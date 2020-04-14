import { createLogger, format, transports } from 'winston'
import { SPLAT } from 'triple-beam'
import moment from 'moment'
import { inspect } from 'util'

export class LoggerUtil {

    public static getLogger(label: string) {
        return createLogger({
            format: format.combine(
                format.label(),
                format.colorize(),
                format.label({ label }),
                format.printf(info => {
                    if(info[SPLAT]) {
                        if(info[SPLAT].length === 1 && info[SPLAT][0] instanceof Error) {
                            const err = info[SPLAT][0] as Error
                            if(info.message.length > err.message.length && info.message.endsWith(err.message)) {
                                info.message = info.message.substring(0, info.message.length-err.message.length)
                            }
                        } else if(info[SPLAT].length > 0) {
                            info.message += ' ' + info[SPLAT].map((it: any) => {
                                if(typeof it === 'object' && it != null) {
                                    return inspect(it, false, null, true)
                                }
                                return it
                            }).join(' ')
                        }
                    }
                    return `[${moment().format('YYYY-MM-DD hh:mm:ss').trim()}] [${info.level}] [${info.label}]: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
                })
            ),
            level: 'debug',
            transports: [
                new transports.Console()
            ]
        })
    }

}