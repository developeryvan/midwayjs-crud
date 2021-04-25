import * as request from 'request';
import { Options, RequestCallback, Response } from 'request';
export default (options: Options, callback?: RequestCallback): Promise<{ response: Response; body: string }> => {
  if (callback) {
    request(options, callback);
  } else {
    return new Promise((resolve, reject) => {
      if (!options) {
        reject({ message: 'no options!' });
      } else {
        try {
          request(options, (err, response, body) => {
            err ? reject(err) : resolve({ response, body });
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  }
};
