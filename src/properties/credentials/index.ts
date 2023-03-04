import stagingCreds from './staging';
import productionCreds from './production';

export type Environment = 'staging' | 'production';
export type UsernameKeys<Env extends Environment> = Env extends 'staging'
  ? keyof typeof stagingCreds
  : keyof typeof productionCreds;

export type Credential = {
  username: string;
  password: string;
  environment: Environment;
};

export function getCredentials<Env extends Environment>(
  environment: Env,
  username: UsernameKeys<Env>
): Credential {
  const password =
    environment === 'staging'
      ? stagingCreds[username as keyof typeof stagingCreds]
      : productionCreds[username as keyof typeof productionCreds];
  return { username, password, environment };
}
