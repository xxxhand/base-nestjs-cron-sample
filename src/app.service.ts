import { Cron } from '@nestjs/schedule';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { appConf } from './app.config';
import { DEFAULT_LOGGER_FACTORY } from './app.constants';

@Injectable()
export class AppService {
  private _Logger: LoggerService;
  constructor(
    @Inject(DEFAULT_LOGGER_FACTORY)
    private readonly loggerFac: (context: string) => LoggerService,
  ) {
    this._Logger = this.loggerFac(AppService.name);
  }

  @Cron(appConf.executeExpression)
  async execute(): Promise<void> {
    this._Logger.log('Impletement logic here....');
  }
}
