export namespace Logger {
  const enum LOGGER_COLORS {
    DANGER = "#A54242",
    SUCCESS = "#B5BD68",
    DEBUG = "#81A2BE",
    WARN = "#F0C674"
  }

  export function debug(context: string, ...message: any[]):void {
    console.log('<span style="color: ' + LOGGER_COLORS.DEBUG + '"> | DEBUG   | ' + buildContextString(context) + ' ', message, '</span>')
  }

  export function success(context: string,...message: any[]):void {
    console.log('<span style="color: ' + LOGGER_COLORS.SUCCESS + '"> | SUCCESS | ' + buildContextString(context) + ' ', message,'</span>')
  }

  export function danger(context: string, ...message: any[]):void {
    console.log('<span style="color: ' + LOGGER_COLORS.DANGER + '"> | DANGER  | ' + buildContextString(context) + ' ', message, '</span>')
  }

  export function warn(context: string, ...message: any[]):void {
    console.log('<span style="color: ' + LOGGER_COLORS.WARN + '"> | WARN    | ' + buildContextString(context) + ' ', message, '</span>')
  }

  function buildContextString(context: string): string {
    let c = "               ";
    c = context.slice(0, 14).concat(c);
    c = c.slice(0, 15);

    return c + "=&gt;".toUpperCase();
  }
}
