import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { InternalServerErrorException } from '@nestjs/common';
import { SENDINBLUE_APIKEY, WEB_BASEURL } from './mail.constant';

let defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = SENDINBLUE_APIKEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export class MailService {
  async sendVerificationMail(email: string, code: string) {
    console.log(email);
    try {
      let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail = {
        to: [
          {
            email,
          },
        ],
        templateId: 4,
        params: {
          link: code,
        },
        headers: {
          'X-Mailin-custom': 'custom_header_1:custom_value_1',
        },
      };
      const mail = await apiInstance.sendTransacEmail(sendSmtpEmail);
      return mail;
    } catch (err) {
      console.error(err.response.text);
      throw new InternalServerErrorException(err);
    }
  }

  sendResetPasswordMail(email: string, name: string, token: string) {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail = {
      to: [
        {
          email,
          name,
        },
      ],
      templateId: 3,
      params: {
        link: `${WEB_BASEURL}/auth/reset-password?token=${token}`,
        name,
      },
      headers: {
        'X-Mailin-custom': 'custom_header_1:custom_value_1',
      },
    };
    return apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}
