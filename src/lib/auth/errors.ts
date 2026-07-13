const errorMap: [string, string][] = [
  ["Invalid login credentials", "Email ou senha incorretos"],
  ["Email not confirmed", "Email não confirmado. Verifique sua caixa de entrada"],
  ["User already registered", "Este email já está cadastrado"],
  ["Password should be at least 6 characters", "A senha deve ter no mínimo 6 caracteres"],
  ["Unable to validate email address: invalid format", "Formato de email inválido"],
  ["Rate limit exceeded", "Muitas tentativas. Aguarde um momento"],
  ["New email address required", "Informe um email"],
  ["Database error creating new user", "Erro ao criar conta. Tente novamente"],
  ["Invalid email or password", "Email ou senha incorretos"],
  ["Email rate limit exceeded", "Muitas tentativas. Aguarde um momento"],
  ["Signup requires a valid password", "A senha deve ter no mínimo 6 caracteres"],
];

export function translateAuthError(message: string): string {
  for (const [key, value] of errorMap) {
    if (key === message) return value;
  }
  return message;
}
