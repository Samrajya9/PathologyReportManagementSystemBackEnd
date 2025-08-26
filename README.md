## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

# Refernce Folder Structure

src/
├─ global/
│ ├─ config/
│ │ ├─ database/
│ │ │ ├─ typeorm.config.ts
│ │ │ └─ dataSource.ts
│ │ ├─ redis.config.ts
│ │ └─ index.ts
│ ├─ dto/
│ │ └─ base-response.dto.ts
│ ├─ decorators/
│ ├─ interceptors/
│ └─ filters/
├─ common/
│ ├─ utils/
│ ├─ constants/
│ ├─ enums/
│ └─ validators/
├─ modules/
│ ├─ tests/
│ │ ├─ dto/
│ │ ├─ entities/
│ │ ├─ tests.controller.ts
│ │ ├─ tests.service.ts
│ │ └─ tests.module.ts
│ └─ panels/
├─ main.ts
