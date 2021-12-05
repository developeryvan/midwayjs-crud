import { Rule, RuleType } from '@midwayjs/validate';
export class RoleDto {
  @Rule(RuleType.string().required()) public roleId: string;
  @Rule(RuleType.string().required()) public roleName: string;
  @Rule(RuleType.boolean()) public status: boolean;
}
