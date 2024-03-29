import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

/**
 * Verifies the configured Webhook from WhatsApp. This function is called when WhatsApp sends a request to your server to verify that the request is indeed coming from WhatsApp.
 * @returns status code 200 for success, 400 for error
 */
export function whatsAppVerify(req: Request, res: Response) {
  // This is required for verification of the webhook
  // console.log('\nCalling whatsAppVerify\n');
  const verifyToken = 'token';
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == verifyToken
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
  return;
}

/**
 * Retrieves messages from WhatsApp and extracts the message. It will also send a response back to the webhook
 * @returns
 */
export async function whatsAppRetreiveMessage(req: Request) {
  // console.log('\nCalling whatsAppRetreiveMessage\n');
  const body_param = req.body;

  if (!body_param) {
    // not from the messages webhook so dont process
    console.error('no message received');
    return null;
  } else {
    // TODO: needs to be reworked for more stability
    if (
      body_param.entry &&
      body_param.entry[0].changes[0].value &&
      body_param.entry[0].changes[0].value.messages
    ) {
      return body_param.entry[0].changes[0].value.messages[0];
    } else {
      return null;
    }
  }
}

export async function sendUserMessage(
  phone: string,
  gptResponse: string
): Promise<AxiosResponse | undefined> {
  try {
    // console.log('\nCalling sendUserMessage\n');
    // Fire axios response here
    const messageBody = {
      messaging_product: 'whatsapp',
      to: phone,
      text: {
        body: gptResponse,
      },
    };

    const response = axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_NUMBER_ID}/messages`,
      messageBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (err) {
    console.error(
      'Axios Send Error: Mostly this is related to the auth token not being correct'
    );
    //console.error(err);
    return;
  }
}
