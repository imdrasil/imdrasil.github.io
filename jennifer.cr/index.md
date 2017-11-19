---
layout: 'page'
---
# Jennifer [![Build Status](https://travis-ci.org/imdrasil/jennifer.cr.svg)](https://travis-ci.org/imdrasil/jennifer.cr) [![Latest Release](https://img.shields.io/github/release/imdrasil/jennifer.cr.svg)](https://github.com/imdrasil/jennifer.cr/releases) [![Docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://imdrasil.github.io/site/jennifer.cr/docs/)

Another ActiveRecord pattern implementation for Crystal with a great query DSL and migration mechanism.

## Installation

Add this to your application's `shard.yml`:

```yaml
dependencies:
  jennifer:
    github: imdrasil/jennifer.cr
```

**Also** you need to choose one of existing adapters for your db: [mysql](https://github.com/crystal-lang/crystal-mysql) or [postgres](https://github.com/will/crystal-pg).

## Usage

Jennifer allows you to maintain everything for your models - from db migrations and field mapping to callbacks and building queries. For detailed information see the [guide](https://imdrasil.github.io/site/jennifer.cr/docs/) or [api documentation](https://imdrasil.github.io/site/jennifer.cr/versions).

#### Migration

To start using Jennifer you'll first need to generate a migration:

```shell
$ crystal sam.cr -- generate:migration CreateContact
```

then fill the created migration file with content:

```crystal
class CreateContact20170119011451314 < Jennifer::Migration::Base
  def up
    create_enum(:gender_enum, ["male", "female"]) # postgres specific command
    create_table(:contacts) do |t|
      t.string :name, {:size => 30}
      t.integer :age
      t.integer :tags, {:array => true}
      t.field :gender, :gender_enum
      t.timestamps
    end
  end

  def down
    drop_table :contacts
    drop_enum(:gender_enum)
  end
end
```

and run

```shell
$ crystal sam.cr -- db:setup
```

to create the database and run the newly created migration.
> For command management Jennifer uses [Sam](https://github.com/imdrasil/sam.cr).

#### Model

Several model examples
```crystal
class Contact < Jennifer::Model::Base
  with_timestamps
  mapping(
    id: {type: Int32, primary: true},
    name: String,
    gender: {type: String, default: "male", null: true},
    age: {type: Int32, default: 10},
    description: {type: String, null: true},
    created_at: {type: Time, null: true},
    updated_at: {type: Time, null: true}
  )

  has_many :facebook_profiles, FacebookProfile
  has_and_belongs_to_many :countries, Country
  has_and_belongs_to_many :facebook_many_profiles, FacebookProfile, join_foreign: :profile_id
  has_one :passport, Passport

  validates_inclucion :age, 13..75
  validates_length :name, minimum: 1, maximum: 15
  validates_with_method :name_check

  scope :main { where { _age > 18 } }
  scope :older { |age| where { _age >= age } }
  scope :ordered { order(name: :asc) }

  def name_check
    if @description && @description.not_nil!.size > 10
      errors.add(:description, "Too large description")
    end
  end
end

class Passport < Jennifer::Model::Base
  mapping(
    enn: {type: String, primary: true},
    contact_id: {type: Int32, null: true}
  )

  validates_with [EnnValidator]
  belongs_to :contact, Contact
end

class Profile < Jennifer::Model::Base
  mapping(
    id: {type: Int32, primary: true},
    login: String,
    contact_id: Int32?,
    type: String
  )

  belongs_to :contact, Contact
end

class FacebookProfile < Profile
  sti_mapping(
    uid: String
  )

  has_and_belongs_to_many :facebook_contacts, Contact, foreign: :profile_id
end

class Country < Jennifer::Model::Base
  mapping(
    id: {type: Int32, primary: true},
    name: String
  )

  validates_exclusion :name, ["asd", "qwe"]
  validates_uniqueness :name

  has_and_belongs_to_many :contacts, Contact
end
```

#### Quering

Jennifer allows you to query the db using a flexible DSL:
```crystal
Contact.all.left_join(Passport) { _contact_id == _contact__id }
            .order(id: :asc)
            .with(:passport).to_a
Contact.all.eager_load(:countries).where { __countries { _name.like("%tan%") } }
Contact.all.group(:gender).group_avg(:age, PG::Numeric)
```

Much more about the query DSL can be found on the wiki [[page|Query-DSL]]

### Important restrictions

- sqlite3 has many limitations so its support won't be added any time soon

### Similar shards

- [active_record.cr](https://github.com/waterlink/active_record.cr) - small simple AR realization

- [crecto](https://github.com/vladfaust/core.cr) - based on Phoenix's ecto lib and follows the repository pattern; 

- [granite-orm](https://github.com/amberframework/granite-orm) - light weight orm focusing on mapping fields from request to your objects

- [topaz](https://github.com/topaz-crystal/topaz) - inspired by AR ORM with migration mechanism

- [micrate](https://github.com/juanedi/micrate) - standalone migration tool for crystal

### Versioning

Now that Jennifer is under heavy development, there could be many breaking changes. So please check the release notes (which will be added to each release starting from 0.3.4) to check if any of the changes may prevent you from using it. Also, until this library reaches a beta version, the next version rules will be followed:

- all bugfixies, new minor features or (sometimes) ones that don't break the existing API will be added as a patch number (e.g. 0.3.**4**);

- all breaking changes and new important features (as well as reaching a milestone) will be added by bumping the minor digit (0.**4**.0);

So even a patch version change could bring a lot of new stuff.

If there is a branch for the next release - it will be removed 1 month after the release. So please use them only as a hotfix or for experiments or contibution.

### Test

The fastest way to rollback all changes in the DB after test case is by using a transaction. So add:
```crystal
Spec.before_each do
  Jennifer::Adapter.adapter.begin_transaction
end

Spec.after_each do
  Jennifer::Adapter.adapter.rollback_transaction
end
```

to your `spec_helper.cr`. NB. you could simply use regular deleting or truncation, but a transaction will provide a 15x speed up (at least for postgres; mysql gets less impact).

> This functions can be safely used only under test environment.

## Development

> Before developing any feature please create an issue where you describe your idea.

Before development create the db user (see `/spec/config.cr` file) by running
```shell
$ crystal example/migrate.cr -- db:setup
```

PostgreSQL is used by default, but MySql is also supported while running tests by using:
```shell
$ DB=mysql crystal spec
```

## Documentation

Self documentation is not fully support yet but docs can be compiled using this shell script:

```shell
$ ./generate-docs.sh
```

NB. It also depends on then choosen adapter (postgres by default).


The wiki pages also have a lot of usefull information. But from version 0.3.4 no new information will be added there untill it is moved to separate `.md` pages to allow contributing.


## Contributing

1. [Fork it]( https://github.com/imdrasil/jennifer.cr/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

Please ask me before starting work on smth.

Also if you want to use it in your application (NB. shard is almost ready for use in production) - please ping me at the email you can find in my profile.

To run tests use the regular `crystal spec`. All migrations are under the `./examples/migrations` directory.

## Contributors

- [imdrasil](https://github.com/imdrasil) Roman Kalnytskyi - creator, maintainer
