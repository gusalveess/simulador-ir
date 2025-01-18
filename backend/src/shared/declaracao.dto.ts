export class CriarDeclaracaoDto {
    ano: number;
    dados: object;
  }
  
  export class AtualizarDeclaracaoDto {
    dados?: object;
    status?: string;
  }