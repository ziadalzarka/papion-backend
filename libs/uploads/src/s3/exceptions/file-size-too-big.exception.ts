import { ConfigUtils } from 'app/config/config.util';
import * as filesize from 'filesize';
import { UnprocessableEntityException } from '@nestjs/common';

export class FileSizeTooBigException extends UnprocessableEntityException {
  constructor(bytes: number) {
    super(`File size is too big. Maximum file size is ${filesize(ConfigUtils.files.maximumSize)} \
    and submitted file size is ${filesize(bytes)}.`, 'file/too-big');
  }
}
