import { NextApiResponse, NextApiRequest } from 'next';
import { serialize } from 'cookie';

type CookieOptions =
  | {
      expires: Date;
      maxAge: number;
    }
  | {};

interface ICookieNextApiRequest extends NextApiResponse {
  cookie: (name: string, value: string, options?: CookieOptions) => void;
}

/**
 * This sets `cookie` on `res` object
 */
const cookie = (res: NextApiResponse, name: string, value: string, options: CookieOptions = {}) => {
  const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const cookies = (handler: any) => (req: NextApiRequest, res: ICookieNextApiRequest) => {
  res.cookie = (name, value, options) => cookie(res, name, value, options);
  // u can set your custom cookie
  res.cookie('luffyzh', 'handsome');
  return handler(req, res);
};

export default cookies;
