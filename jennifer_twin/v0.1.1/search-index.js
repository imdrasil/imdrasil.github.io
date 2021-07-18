crystal_doc_search_index_callback({"repository_name":"jennifer_twin","body":"# JenniferTwin [![Latest Release](https://img.shields.io/github/release/imdrasil/jennifer_twin.svg)](https://github.com/imdrasil/jennifer_twin/releases)\n\nSuper simple library to dump/load [Jennifer](https://github.com/imdrasil/jennifer.cr) model attributes to plain class instance to be able to integrate it with any kind of hidden attributes.\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n```yaml\ndependencies:\n  jennifer_twin:\n    github: imdrasil/jennifer_twin\n    version: 0.1.1\n```\n\n2. Run `shards install`\n\n## Usage\n\nJennifer generates some amount of hidden attributes for a mode to be able to track whether attribute has been changed, relation load state or just a collection, etc. For some tasks you would like to have an instance containing only model attributes or it's subset. One of the most popular example - `JSON::Serializable`. Therefor JenniferTwin copies all data from original instance and store them.\n\n> If you trying to solve issue of model serialization to JSON - take a look at [Serializer](https://github.com/imdrasil/serializer).\n\nTo create a **twin** include `JenniferTwin` and call `.map_fields` macro:\n\n```crystal\nrequire \"jennifer_twin\"\n\nclass UserTwin\n  include JenniferTwin\n\n  map_fields User\nend\n```\n\n### Mapping\n\n`.map_fields` macro generates only 3 things:\n\n- getters for all fields named after model's ones (unless other name is specified)\n- initializer accepting model instance to copy\n- `#to_model` method to create a model instance from it's fields\n\n```crystal\nuser = User.all.first\nuser_twin = UserTwin.new(user)\nuser_twin.to_model # => User\n```\n\nAs a 2nd argument macro accepts named tuple or symbol-based hash of field options. Supported options are:\n\n- `:ignore` - if set to `true` ignores specified field\n- `:key` - defines attribute with the specified value\n- `:annotations` - adds annotations above field setter\n\nLet's take a look at more descriptive example:\n\n```crystal\nclass User < Jennifer::Model::Base\n  mapping(\n    id: Primary32,\n    name: String?,\n    age: Int32?,\n    password_hash: String?\n  )\nend\n\nclass UserTwin\n  include JenniferTwin\n  include JSON::Serializable\n\n  map_fields(User, {\n    age: { annotations: [@[JSON::Field(emit_null: true)]] }\n    name: { key: :full_name },\n    password_hash: { ignore: true }\n  })\n\n  setter full_name\nend\n\nuser = User.all.first # <User:0x000000000010 id: 1, name: \"User 8\", age: nil, password_hash: \"<hash>\">\nuser_twin = UserTwin.new(user) # <UserTwin:0x000000000020 @id=1, @full_name=\"User 8\", @age=nil>\nuser_twin.to_json # => %({\"id\":1,\"full_name\":\"User 8\",\"age\":null})\n\nuser_twin.full_name = \"New Name\"\nuser_twin.to_modal # <User:0x000000000030 id: nil, name: \"New Name\", age: nil, password_hash: nil>\n```\n\nAlso you can add additional custom logic to generated initializer passing a block to the macro call. To access model instance use `record` variable name.\n\n```crystal\nclass UserTwin\n  include JenniferTwin\n\n  getter full_name : String\n\n  map_fields(User) do\n    @full_name = \"#{record.name} Snow\"\n  end\nend\n```\n\n## Contributing\n\n1. Fork it (<https://github.com/imdrasil/jennifer_twin/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Roman Kalnytskyi](https://github.com/imdrasil) - creator and maintainer\n","program":{"html_id":"jennifer_twin/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"jennifer_twin","program":true,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"jennifer_twin/JenniferTwin","path":"JenniferTwin.html","kind":"module","full_name":"JenniferTwin","name":"JenniferTwin","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/jennifer_twin.cr","line_number":18,"url":"https://github.com/imdrasil/jennifer_twin/blob/v0.1.1/src/jennifer_twin.cr#L18"}],"repository_name":"jennifer_twin","program":false,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[{"id":"VERSION","name":"VERSION","value":"\"0.1.1\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":"Allows to dump and load Jennifer model attributes to plain class. This allows to add any king of annotations,\nrenaming, avoid callbacks and validations.\n\n```\nclass UserTwin\n  include JenniferTwin\n  include JSON::Serializable\n\n  map_fields(User, {\n    id: { annotations: [@[JSON::Field(emit_null: true)]] }\n    name: { key: :full_name },\n    password_hash: { ignore: true }\n  })\n\n  setter full_name\nend\n```","summary":"<p>Allows to dump and load Jennifer model attributes to plain class.</p>","class_methods":[],"constructors":[],"instance_methods":[{"id":"to_model-instance-method","html_id":"to_model-instance-method","name":"to_model","doc":"Returns a new instance of model class created from current twin state.\n\n```\nuser = User.all.first\nuser_twin.full_name = \"New Name\"\nuser_twin.to_modal # <User:0x000000000030 id: nil, name: \"New Name\">\n```","summary":"<p>Returns a new instance of model class created from current twin state.</p>","abstract":true,"args":[],"args_string":"","args_html":"","location":{"filename":"src/jennifer_twin.cr","line_number":28,"url":"https://github.com/imdrasil/jennifer_twin/blob/v0.1.1/src/jennifer_twin.cr#L28"},"def":{"name":"to_model","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":""}}],"macros":[{"id":"map_fields(klass,options={}ofNil=>Nil)-macro","html_id":"map_fields(klass,options={}ofNil=&gt;Nil)-macro","name":"map_fields","doc":"Creates constructor and declare getters for all fields from parent modal *klass* except those specified\nto be ignored.\n\nArguments:\n* *klass* - class literal to be used as a related model class\n* *options* - field specific options; by default model field is mapped to the one with same name and type;\nsupported options:\n  * *key* - new field name\n  * *ignore* - mark field to be ignored\n  * *annotations* - array of annotations to be added above setter declaration\n* *block* - given block is appended to the constructor; `record` variable can be used to get model instance.","summary":"<p>Creates constructor and declare getters for all fields from parent modal <em>klass</em> except those specified to be ignored.</p>","abstract":false,"args":[{"name":"klass","doc":null,"default_value":"","external_name":"klass","restriction":""},{"name":"options","doc":null,"default_value":"{} of Nil => Nil","external_name":"options","restriction":""}],"args_string":"(klass, options = {} <span class=\"k\">of</span> <span class=\"t\">Nil</span> => <span class=\"t\">Nil</span>)","location":{"filename":"src/jennifer_twin.cr","line_number":41,"url":"https://github.com/imdrasil/jennifer_twin/blob/v0.1.1/src/jennifer_twin.cr#L41"},"def":{"name":"map_fields","args":[{"name":"klass","doc":null,"default_value":"","external_name":"klass","restriction":""},{"name":"options","doc":null,"default_value":"{} of Nil => Nil","external_name":"options","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"    \n{% metadata = klass.resolve.constant(\"COLUMNS_METADATA\") %}\n\n    \n{% for field, opts in metadata %}\n      {% if !(options[field] && (options[field][:ignore] == true)) %}\n        {% field_name = (options[field] ? options[field][:key] : nil) || field %}\n        {{ options[field] && options[field][:annotations] ? (options[field][:annotations].join(\"\\n\")).id : \"\" }}\n        getter {{ field_name.id }} : {{ opts[:parsed_type].id }}\n      {% end %}\n    {% end %}\n\n\n\n    def initialize(record : \n{{ klass }}\n)\n      \n{% for field, opts in metadata %}\n        {% if !(options[field] && (options[field][:ignore] == true)) %}\n          {% field_name = (options[field] ? options[field][:key] : nil) || field %}\n          @{{ field_name.id }} = record.{{ field.id }}\n        {% end %}\n      {% end %}\n\n      \n{{ yield }}\n\n    \nend\n\n    def to_model : \n{{ klass }}\n\n      \n{{ klass }}\n.new(\n{\n        \n{% for field, opts in metadata %}\n          {% if !(options[field] && (options[field][:ignore] == true)) %}\n            {% field_name = (options[field] ? options[field][:key] : nil) || field %}\n            {{ field.id }}: @{{ field_name.id }},\n          {% end %}\n        {% end %}\n\n      })\n    \nend\n  \n"}}],"types":[]}]}})