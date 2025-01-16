import { Cron } from '@nestjs/schedule';
import { CustomMongoClient } from '@xxxhand/app-common';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { appConf } from './app.config';
import { DEFAULT_LOGGER_FACTORY, DEFAULT_MONGO } from './app.constants';

@Injectable()
export class AppService {
  private _Logger: LoggerService;
  private _isRunning = false;
  constructor(
    @Inject(DEFAULT_LOGGER_FACTORY)
    private readonly loggerFac: (context: string) => LoggerService,
    @Inject(DEFAULT_MONGO)
    private readonly db: CustomMongoClient,
  ) {
    this._Logger = this.loggerFac(AppService.name);
  }

  @Cron(appConf.executeExpression)
  async execute(): Promise<void> {
    // Must have try catch block to handle error
    try {
      if (this._isRunning) {
        this._Logger.log('Last task is not completed yet...');
        return;
      }
      this._isRunning = true;
      await this.db.tryConnect();
      this._Logger.log('Impletement logic here....');

    } catch (error) {
      this._Logger.error(error.message);
      this._Logger.error(error.stack);
    } finally {
      await this._terminate();
    }
  }

  private async _terminate(): Promise<void> {
    await this.db.close();
    this._isRunning = false;
  }
}
