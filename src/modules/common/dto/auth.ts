import { Rule, RuleType } from '@midwayjs/validate';
export class LoginDto {
  @Rule(RuleType.string()) public password: string;
  @Rule(RuleType.string()) public phone: string;
  @Rule(RuleType.string()) public username: string;
}
export class LogoutDto {
  @Rule(RuleType.string()) public token: string;
}
