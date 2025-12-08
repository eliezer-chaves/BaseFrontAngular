# BaseFrontAngular

Uma aplicação frontend moderna com autenticação completa, internacionalização e personalização de temas, construída com Angular 20, NG-ZORRO e Google Material Icons.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração HTTPS Local](#configuração-https-local)
- [Executando o Projeto](#executando-o-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Backend](#backend)
- [Bibliotecas de UI](#bibliotecas-de-ui)

## 🎯 Sobre o Projeto

BaseFrontAngular é uma aplicação frontend completa que oferece uma experiência moderna e responsiva com sistema de autenticação, suporte a múltiplos idiomas e temas personalizáveis.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** - Login e criação de conta
- 🚪 **Logout seguro** - Encerramento de sessão
- 🌍 **Internacionalização (i18n)** - Suporte a múltiplos idiomas
- 🎨 **Mudança de temas** - Tema claro e escuro
- 📱 **Design responsivo** - Interface adaptável a diferentes dispositivos
- 🍪 **Cookies HTTP-only** - Segurança na gestão de tokens JWT

## 🛠️ Tecnologias Utilizadas

- **Angular** 20 - Framework principal
- **NG-ZORRO** - Biblioteca de componentes UI baseada em Ant Design
- **Google Material Icons** - Ícones do Material Design
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)
- **npm** (geralmente vem com Node.js)
- **Angular CLI** (será instalado globalmente)
- **Git** (para clonar o repositório)
- **mkcert** (para certificados SSL locais - opcional)

## 🚀 Instalação

### 1️⃣ Instale as dependências

```bash
npm install
```

### 2️⃣ Instale o Angular CLI globalmente (se ainda não tiver)

```bash
npm install -g @angular/cli
```

## 🔒 Configuração HTTPS Local

Para executar o projeto com HTTPS localmente, siga os passos abaixo:

### 📥 Instalação do mkcert

**1. Baixe o mkcert para Windows:**
   
Acesse: [https://github.com/FiloSottile/mkcert/releases](https://github.com/FiloSottile/mkcert/releases)

Arquivo recomendado: `mkcert-v1.4.4-windows-amd64.exe`

**2. Configure o executável:**

Renomeie o arquivo para `mkcert.exe` e:
- Coloque em uma pasta no PATH (ex.: `C:\Windows\System32`), **OU**
- Mantenha na pasta do projeto e use o caminho completo ao executar

**3. Instale o root CA local (apenas uma vez):**

Abra o PowerShell como administrador (clique com botão direito → "Executar como administrador") e execute:

```powershell
mkcert -install
```

### 🔏 Gerando Certificados SSL

**✅ PASSO 1** — Navegue até a pasta do projeto Angular:

```bash
cd BaseFrontAngular
```

**✅ PASSO 2** — Gere o certificado SSL com mkcert:

```bash
mkcert localhost 127.0.0.1 ::1
```

Isso irá gerar dois arquivos:
- `localhost+2.pem` (certificado)
- `localhost+2-key.pem` (chave privada)

> **Nota:** Apenas para desenvolvimento local. Algumas hospedagens já fornecem o certificado SSL, que é necessário para usar HTTP Cookie Only.

**✅ PASSO 3** — Os certificados estão prontos para uso! 🎉

## ▶️ Executando o Projeto

### Servidor de Desenvolvimento (HTTP)

Para iniciar o servidor local de desenvolvimento, execute:

```bash
ng serve
```

Depois que o servidor estiver rodando, abra seu navegador e navegue até `http://localhost:4200/`. A aplicação será recarregada automaticamente sempre que você modificar qualquer arquivo fonte.

### Servidor de Desenvolvimento (HTTPS)

Para rodar com HTTPS usando os certificados gerados:

```bash
ng serve --ssl true --ssl-cert "localhost+2.pem" --ssl-key "localhost+2-key.pem"
```

Acesse: `https://localhost:4200/`

> **Nota:** Na primeira vez, seu navegador pode mostrar um aviso de segurança. Isso é normal para certificados locais. Clique em "Avançado" e "Prosseguir para localhost".

Agora seu frontend está no HTTPS local: [https://localhost:4200](https://localhost:4200)

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (HTTP)
ng serve

# Iniciar servidor de desenvolvimento (HTTPS)
ng serve --ssl true --ssl-cert "localhost+2.pem" --ssl-key "localhost+2-key.pem"

# Iniciar servidor em uma porta específica
ng serve --port 4300
```

### Build

```bash
# Build de desenvolvimento
ng build

# Build de produção
ng build --configuration production
```

Isso irá compilar seu projeto e armazenar os artefatos de build no diretório `deploy/`. Por padrão, o build de produção otimiza sua aplicação para desempenho e velocidade.

### Testes

```bash
# Executar testes unitários
ng test

# Executar testes end-to-end
ng e2e
```

Para executar testes unitários com o test runner [Karma](https://karma-runner.github.io), use o comando acima.

> **Nota:** O Angular CLI não vem com um framework de testes end-to-end por padrão. Você pode escolher um que atenda às suas necessidades.

### Code Scaffolding

O Angular CLI inclui ferramentas poderosas de scaffolding. Para gerar um novo componente, execute:

```bash
ng generate component nome-do-componente
```

Para uma lista completa de schematics disponíveis (como `components`, `directives` ou `pipes`), execute:

```bash
ng generate --help
```

Outros exemplos:

```bash
# Gerar um serviço
ng generate service services/nome-do-servico

# Gerar um módulo
ng generate module modules/nome-do-modulo

# Gerar um guard
ng generate guard guards/nome-do-guard

# Gerar uma interface
ng generate interface interfaces/nome-da-interface
```

## 🔧 Configuração de Ambiente

Configure suas variáveis de ambiente em:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

Exemplo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:8000/'
};
```

## 🔗 Backend

Este projeto se conecta com uma API backend. Para configurar e executar o backend, acesse:

**BaseAPI:** [https://github.com/eliezer-chaves/BaseAPI.git](https://github.com/eliezer-chaves/BaseAPI.git)

Certifique-se de que o backend esteja rodando antes de iniciar o frontend para garantir o funcionamento completo da aplicação.

## 🎨 Bibliotecas de UI

### NG-ZORRO (Ant Design)

O projeto utiliza NG-ZORRO para componentes de interface. Documentação oficial:
- [NG-ZORRO Documentation](https://ng.ant.design/docs/introduce/en)

### Google Material Icons

Os ícones do Material Design já estão configurados no `index.html`. Para usar:

```html
<span class="material-icons">home</span>
```

Navegue pela lista completa de ícones em: [Material Icons](https://fonts.google.com/icons)

## 📚 Recursos Adicionais

Para mais informações sobre o uso do Angular CLI, incluindo referências detalhadas de comandos, visite a página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## 📝 Licença

Projeto de uso pessoal e educacional.

## 👨‍💻 Autor

Desenvolvido por Eliézer Chaves

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

Desenvolvido com ❤️ usando Angular