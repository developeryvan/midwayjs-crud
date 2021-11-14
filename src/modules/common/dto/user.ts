import { Rule, RuleType } from '@midwayjs/decorator';
export class UserDto {
  @Rule(RuleType.string()) public username: string;
  @Rule(RuleType.string()) public nickname: string;
  @Rule(RuleType.string()) public phone: string;
  @Rule(RuleType.string().min(6)) public password: string;
  @Rule(RuleType.string()) public avatar: string;
  @Rule(RuleType.string()) public role: string;
  @Rule(RuleType.boolean()) public status: boolean;
}
