import { AxiosError } from 'axios';

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isAxiosError(err: any): err is AxiosError {
  return (err as AxiosError).config !== undefined;
}
