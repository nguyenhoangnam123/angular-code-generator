# Angular Generator based on Metronic Theme

=======================

### Setup

=======================
Requirement: Nodejs 10.x
Setup: cd path/to/angular-generator
Install angular-cli globally: npm i @angular/cli -g
Install dependencies: npm install
Build: npm run build

==============================

### Angular Jhipster Structure

==============================

- src
  - main
    - webapp
      - app
        - views
          - pages
            - (generated module)
              - (generated subcomponent folder)
                - (generated component)
                - (generated html)
              - (generated model)
              - (generated datasource)
              - (generated component)
              - (generated html)
              - (generated module)

============================

### Angular Jhipster Linking

============================

- You should link Angular Jhipster project to angular-code-generator to use its features
- Run: npm link path/to/angular-generator (Eg: npm link ../angular-generator)

=======================

### Model and Interface

=======================

- Manifest: you should modify manifest model file before running any command line (path: angular-generator/src/model/model.ts)
- Model: generated class from manifest, including its typescript interface (Eg: Test, ITest)
- Note: model should be generated first before generating other pieces
- Run: ng g angular-generator:model --name=<name> (Eg: ng g angular-generator:model --name=test -> src/main/webapp/app/views/pages/test/test.model.ts)

### Service

- Note: a class which default has getAll, findById, delete, createOrUpdate, getPaging methods
- Run: ng g angular-generator:service --name=<name> (Eg: ng g angular-generator:service --name=test -> src/main/webapp/app/views/pages/test/test.service.ts)

### Datasource

- Note: a class which has methods subscribing service methods by name, also create message Subjects for subscriptions
- Run: ng g angular-generator:datasource --name=<name> (Eg: ng g angular-generator:datasource --name=test -> src/main/webapp/app/views/pages/test/test.datasource.ts)

### Component

### Html

### Module

### Crud
