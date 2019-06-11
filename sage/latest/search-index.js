crystal_doc_search_index_callback({"repository_name":"github.com/imdrasil/sage","body":"# Sage\n\nSage - is a lightweight library for defining resource access policy rules.\n\n## Installation\n\nAdd this to your application's `shard.yml`:\n\n```yaml\ndependencies:\n  sage:\n    github: imdrasil/sage\n```\n\n## Usage\n\nThe core component of Sage is a *policy class* - it describes access policies to resource. That's why it is assumed you define a separate policy class for each resource you want to specify access restrictions.\n\nConsider a simple example:\n\n```crystal\n# It is not necessary to define application base policy class\n# but this allows to put all shared behavior and configs in one place\nabstract class ApplicationPolicy < Sage::Base\nend\n\nclass PostPolicy < ApplicationPolicy\n  constructor(User, Post)\n\n  ability :edit?\n    user.admin? || user.id == resource.id\n  end\n\n  ability :show?\n    true\n  end\nend\n```\n\nNow you can add authorization to your app:\n\n```crystal\nabstract class ApplicationController\n  include Sage::Behavior\n\n  private def current_user\n    User.current_user\n  end\nend\n\nclass PostsController\n  def update\n    @post = Post.find(params[\"id\"])\n    authorize! :update?, @post\n\n    # ...\n  end\nend\n```\n\nIn the above example Sage automatically refers policy class from the given `@post` variable - `Post -> PostPolicy`. The `user` is automatically used from calling `sage_user` method (which by default calls `current_user`).\n\nWhen authorization is passed successfully (corresponding ability returned `true`), nothing happens, but in case of an authorization failure `Sage::UnauthorizedError` error is raised.\n\nThere are also an `able?` nad `unable?` methods which return `true` or `false`:\n\n```crystal\nable?(:update?, @post)\nunable?(:update?, @post)\n```\n\nAlso you may specify exact policy class:\n\n```crystal\nable?(:update, @post, within: EditorPostPolicy)\nauthorize!(:update?, @post, within: EditorPostPolicy)\n```\n\n### Writing Policies\n\nPolicy class contains defined abilities (partially they are just a predicate methods) which are used to authorize activities.\n\nEach policy record is instantiated with the target `resource : T` object and authorization context `user : U`. To avoid generics, they should define corresponding attribute types for themselves. As a plugin `constructor` macro could be used for doing this:\n\n```crystal\nclass PostPolicy < Sage::Base\n  constructor(User, Post)\n\n  # This call is the same as\n\n  getter user : User, resource : Post\n\n  def initialize(@user, @resource)\n  end\nend\n```\n\n> NOTE: `#user` method is abstract so should be defined by subclasses.\n\nTo define ability use corresponding macro `ability`:\n\n```crystal\nclass PostPolicy < Sage::Base\n  # ...\n  ability :update? do\n    user.admin? || user.id == resource.user_id\n  end\nend\n```\n\n#### Calling other policies\n\nIt may be useful to call other resource policy from within a current one. For doing this you can use standard `#able?` and `#unable?` methods:\n\n```crystal\nclass CommentPolicy < Sage::Policy\n  # ...\n\n  ability :update? do\n    user.admin? || user.id == resource.id || able?(:update?, resource.post)\n  end\nend\n```\n\n### Testing\n\nPolicies can be tested as any other Crystal classes:\n\n```crystal\ndescribe PostPolicy do\n  described_class = PostPolicy\n\n  describe \"#update?\"\n    it \"returns false when the user is not admin nor author\" do\n      user = User.new\n      post = Post.new\n      policy = described_class.new(user, post)\n      policy.apply(:update?).should be_false\n    end\n\n    it \"returns true when the user is admin\" do\n      user = User.new(:admin)\n      post = Post.new\n      policy = described_class.new(user, post)\n      policy.apply(:update?).should be_true\n    end\n\n    it \"returns true when the user is author\" do\n      user = User.new\n      post = Post.new(user_id: user.id)\n      policy = described_class.new(user, post)\n      policy.apply(:update?).should be_true\n    end\n  end\nend\n```\n\n### Aliases\n\nSage allows you to add ability aliases. It may be useful when you rely on implicit rules in your code:\n\n```crystal\nclass PostController\n  def edit\n    # ...\n    authorize! :edit?, @post\n    # ...\n  end\n\n  def update\n    # ...\n    authorize! :update?, @post\n    # ...\n  end\n\n  def destroy\n    # ...\n    authorize! :destroy?, @post\n    # ...\n  end\nend\n```\n\nIn your policy you can create alias to avoid code duplication:\n\n```crystal\nclass PostPolicy < Sage::Base\n  # ...\n  alias_ability :update?, :edit?, to: :update?\n  # ...\nend\n```\n\n> NOTE: `alias_ability` doesn't create aliased methods and resolve them only during `Sage::Base#apply` call (which is under the hood of `able?` and `authorize!`).\n\n#### Default Ability\n\nWhen Sage can't resolve ability name it calls `Sage::Base#default_ability` method which by default returns `false`. You may override it to define another behavior.\n\n### Pre-Checks\n\nSometimes it happens that some of your abilities (or even all of them) starts with the same conditions. Example:\n\n```crystal\nclass PostPolicy < Sage::Base\n  # ...\n  ability :show? do\n    user.admin? || resource.published?\n  end\n\n  ability :update? do\n    user.admin? || user.id == resource.user_id\n  end\n  # ...\nend\n```\n\nYou can separate the common parts from all abilities to a separate *pre-checks*:\n\n```crystal\nclass PostPolicy < Sage::Base\n  # ...\n  pre_check :admin?\n\n  ability :show? do\n    resource.published?\n  end\n\n  ability :update? do\n    user.id == resource.user_id\n  end\n\n  private def admin?\n    allow! if user.admin?\n  end\n  # ...\nend\n```\n\nPre-checks are executed before ability invocation. They allow to halt the authorization process - just return `allow!` or `disallow!` call value. Any other returned value is ignored.\n\n## Contributing\n\n1. Fork it ( https://github.com/imdrasil/sage/fork )\n2. Create your feature branch (git checkout -b my-new-feature)\n3. Commit your changes (git commit -am 'Add some feature')\n4. Push to the branch (git push origin my-new-feature)\n5. Create a new Pull Request\n\n## Contributors\n\n- [imdrasil](https://github.com/imdrasil) Roman Kalnytskyi - creator, maintainer\n\n### Inspired by\n\n- [Action Policy](https://github.com/palkan/action_policy)\n- [Pundit](https://github.com/varvet/pundit)\n- [CancanCan](https://github.com/CanCanCommunity/cancancan)\n","program":{"html_id":"github.com/imdrasil/sage/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"github.com/imdrasil/sage","program":true,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/imdrasil/sage/Sage","path":"Sage.html","kind":"module","full_name":"Sage","name":"Sage","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"sage/exceptions.cr","line_number":1,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/exceptions.cr"},{"filename":"sage/policy/finder.cr","line_number":1,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/finder.cr"},{"filename":"sage/behavior.cr","line_number":3,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr"},{"filename":"sage/base.cr","line_number":3,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr"},{"filename":"sage/version.cr","line_number":1,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/version.cr"},{"filename":"sage.cr","line_number":6,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[{"id":"VERSION","name":"VERSION","value":"\"0.1.0\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/imdrasil/sage/Sage/Base","path":"Sage/Base.html","kind":"class","full_name":"Sage::Base","name":"Base","abstract":true,"superclass":{"html_id":"github.com/imdrasil/sage/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"github.com/imdrasil/sage/Sage/Behavior","kind":"module","full_name":"Sage::Behavior","name":"Behavior"},{"html_id":"github.com/imdrasil/sage/Sage/Policy/Definition","kind":"module","full_name":"Sage::Policy::Definition","name":"Definition"},{"html_id":"github.com/imdrasil/sage/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/imdrasil/sage/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"sage/base.cr","line_number":4,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[{"html_id":"github.com/imdrasil/sage/Sage/Behavior","kind":"module","full_name":"Sage::Behavior","name":"Behavior"},{"html_id":"github.com/imdrasil/sage/Sage/Policy/Definition","kind":"module","full_name":"Sage::Policy::Definition","name":"Definition"}],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/imdrasil/sage/Sage","kind":"module","full_name":"Sage","name":"Sage"},"doc":null,"summary":null,"class_methods":[{"id":"apply(user,action,resource)-class-method","html_id":"apply(user,action,resource)-class-method","name":"apply","doc":null,"summary":null,"abstract":false,"args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":""},{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""},{"name":"resource","doc":null,"default_value":"","external_name":"resource","restriction":""}],"args_string":"(user, action, resource)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L13","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L13","def":{"name":"apply","args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":""},{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""},{"name":"resource","doc":null,"default_value":"","external_name":"resource","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"{% if true %}\n        {{ @type }}.new(user, resource).apply(action)\n      {% end %}"}}],"constructors":[{"id":"new(user,resource)-class-method","html_id":"new(user,resource)-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":""},{"name":"resource","doc":null,"default_value":"","external_name":"resource","restriction":""}],"args_string":"(user, resource)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L10","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L10","def":{"name":"new","args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":""},{"name":"resource","doc":null,"default_value":"","external_name":"resource","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(user, resource)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"id":"allow!-instance-method","html_id":"allow!-instance-method","name":"allow!","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L23","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L23","def":{"name":"allow!","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":":allow"}},{"id":"apply(action)-instance-method","html_id":"apply(action)-instance-method","name":"apply","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""}],"args_string":"(action)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L41","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L41","def":{"name":"apply","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"res = perform_pre_check\nif res.nil?\nelse\n  return res\nend\nfound_action = find_action_name(action)\ncheck_policy(found_action)\n"}},{"id":"check_policy(action)-instance-method","html_id":"check_policy(action)-instance-method","name":"check_policy","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""}],"args_string":"(action)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L37","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L37","def":{"name":"check_policy","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"default_ability"}},{"id":"default_ability-instance-method","html_id":"default_ability-instance-method","name":"default_ability","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L33","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L33","def":{"name":"default_ability","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"false"}},{"id":"disallow!-instance-method","html_id":"disallow!-instance-method","name":"disallow!","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L27","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L27","def":{"name":"disallow!","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":":disallow"}},{"id":"find_action_name(action)-instance-method","html_id":"find_action_name(action)-instance-method","name":"find_action_name","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""}],"args_string":"(action)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L48","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L48","def":{"name":"find_action_name","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"action"}},{"id":"perform_pre_check-instance-method","html_id":"perform_pre_check-instance-method","name":"perform_pre_check","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L31","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L31","def":{"name":"perform_pre_check","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":""}},{"id":"sage_user-instance-method","html_id":"sage_user-instance-method","name":"sage_user","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L19","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L19","def":{"name":"sage_user","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"user"}},{"id":"user-instance-method","html_id":"user-instance-method","name":"user","doc":null,"summary":null,"abstract":true,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L11","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/base.cr#L11","def":{"name":"user","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":""}}],"macros":[],"types":[]},{"html_id":"github.com/imdrasil/sage/Sage/Behavior","path":"Sage/Behavior.html","kind":"module","full_name":"Sage::Behavior","name":"Behavior","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"sage/behavior.cr","line_number":4,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[{"html_id":"github.com/imdrasil/sage/Sage/Base","kind":"class","full_name":"Sage::Base","name":"Base"}],"namespace":{"html_id":"github.com/imdrasil/sage/Sage","kind":"module","full_name":"Sage","name":"Sage"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[{"id":"able?(action:Symbol,object,within:T.class)forallT-instance-method","html_id":"able?(action:Symbol,object,within:T.class)forallT-instance-method","name":"able?","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""},{"name":"within","doc":null,"default_value":"","external_name":"within","restriction":"T.class"}],"args_string":"(action : Symbol, object, within : T.class) forall T","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L25","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L25","def":{"name":"able?","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""},{"name":"within","doc":null,"default_value":"","external_name":"within","restriction":"T.class"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"(T.new(sage_user, object)).apply(action)"}},{"id":"able?(action:Symbol,object)-instance-method","html_id":"able?(action:Symbol,object)-instance-method","name":"able?","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"args_string":"(action : Symbol, object)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L17","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L17","def":{"name":"able?","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"(policy(object)).apply(action)"}},{"id":"sage_user-instance-method","html_id":"sage_user-instance-method","name":"sage_user","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L33","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L33","def":{"name":"sage_user","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"current_user"}},{"id":"unable?(action:Symbol,object,within)-instance-method","html_id":"unable?(action:Symbol,object,within)-instance-method","name":"unable?","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""},{"name":"within","doc":null,"default_value":"","external_name":"within","restriction":""}],"args_string":"(action : Symbol, object, within)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L29","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L29","def":{"name":"unable?","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""},{"name":"within","doc":null,"default_value":"","external_name":"within","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"!(able?(action, object, within))"}},{"id":"unable?(action:Symbol,object)-instance-method","html_id":"unable?(action:Symbol,object)-instance-method","name":"unable?","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"args_string":"(action : Symbol, object)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L21","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L21","def":{"name":"unable?","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"!(able?(action, object))"}},{"id":"unauthorized_error_message-instance-method","html_id":"unauthorized_error_message-instance-method","name":"unauthorized_error_message","doc":null,"summary":null,"abstract":false,"args":[],"args_string":"","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L37","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L37","def":{"name":"unauthorized_error_message","args":[],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":""}}],"macros":[{"id":"authorize!(action,object)-macro","html_id":"authorize!(action,object)-macro","name":"authorize!","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"args_string":"(action, object)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L5","def":{"name":"authorize!","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"      raise Sage::UnauthorizedError.new(unauthorized_error_message, \n{{ action }}\n) unless able?(\n{{ action }}\n, \n{{ object }}\n)\n    \n"}},{"id":"authorize!(action,object,withinpolicy_class)-macro","html_id":"authorize!(action,object,withinpolicy_class)-macro","name":"authorize!","doc":null,"summary":null,"abstract":false,"args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""},{"name":"policy_class","doc":null,"default_value":"","external_name":"within","restriction":""}],"args_string":"(action, object, within policy_class)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L9","def":{"name":"authorize!","args":[{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":""},{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""},{"name":"policy_class","doc":null,"default_value":"","external_name":"within","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"      raise Sage::UnauthorizedError.new(unauthorized_error_message, \n{{ action }}\n) unless able?(\n{{ action }}\n, \n{{ object }}\n, \n{{ policy_class }}\n)\n    \n"}},{"id":"policy(object)-macro","html_id":"policy(object)-macro","name":"policy","doc":null,"summary":null,"abstract":false,"args":[{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"args_string":"(object)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/behavior.cr#L13","def":{"name":"policy","args":[{"name":"object","doc":null,"default_value":"","external_name":"object","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"      ::Sage::Policy::Finder.policy(sage_user, \n{{ object }}\n)\n    \n"}}],"types":[]},{"html_id":"github.com/imdrasil/sage/Sage/Policy","path":"Sage/Policy.html","kind":"module","full_name":"Sage::Policy","name":"Policy","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"sage/policy/finder.cr","line_number":2,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/finder.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/imdrasil/sage/Sage","kind":"module","full_name":"Sage","name":"Sage"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[{"html_id":"github.com/imdrasil/sage/Sage/Policy/Definition","path":"Sage/Policy/Definition.html","kind":"module","full_name":"Sage::Policy::Definition","name":"Definition","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"sage/policy/definition.cr","line_number":1,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/definition.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[{"html_id":"github.com/imdrasil/sage/Sage/Base","kind":"class","full_name":"Sage::Base","name":"Base"}],"namespace":{"html_id":"github.com/imdrasil/sage/Sage/Policy","kind":"module","full_name":"Sage::Policy","name":"Policy"},"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[{"id":"ability(name)-macro","html_id":"ability(name)-macro","name":"ability","doc":null,"summary":null,"abstract":false,"args":[{"name":"name","doc":null,"default_value":"","external_name":"name","restriction":""}],"args_string":"(name)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/definition.cr#L15","def":{"name":"ability","args":[{"name":"name","doc":null,"default_value":"","external_name":"name","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"    \n{% POLICIES << name.id.stringify %}\n\n\n    def \n{{ name.id }}\n : Bool\n      \n{{ yield }}\n\n    \nend\n  \n"}},{"id":"alias_ability(*abilities,toability)-macro","html_id":"alias_ability(*abilities,toability)-macro","name":"alias_ability","doc":null,"summary":null,"abstract":false,"args":[{"name":"abilities","doc":null,"default_value":"","external_name":"abilities","restriction":""},{"name":"ability","doc":null,"default_value":"","external_name":"to","restriction":""}],"args_string":"(*abilities, to ability)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/definition.cr#L23","def":{"name":"alias_ability","args":[{"name":"abilities","doc":null,"default_value":"","external_name":"abilities","restriction":""},{"name":"ability","doc":null,"default_value":"","external_name":"to","restriction":""}],"double_splat":null,"splat_index":0,"block_arg":null,"visibility":"Public","body":"    \n{% if ALIASES[ability] == nil\n  ALIASES[ability] = [] of Array(String)\nend\ncontainer = ALIASES[ability]\n %}\n\n    \n{% for aliased_ability in abilities %}\n      {% container << aliased_ability %}\n    {% end %}\n\n  \n"}},{"id":"constructor(user_class,resource_class)-macro","html_id":"constructor(user_class,resource_class)-macro","name":"constructor","doc":null,"summary":null,"abstract":false,"args":[{"name":"user_class","doc":null,"default_value":"","external_name":"user_class","restriction":""},{"name":"resource_class","doc":null,"default_value":"","external_name":"resource_class","restriction":""}],"args_string":"(user_class, resource_class)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/definition.cr#L2","def":{"name":"constructor","args":[{"name":"user_class","doc":null,"default_value":"","external_name":"user_class","restriction":""},{"name":"resource_class","doc":null,"default_value":"","external_name":"resource_class","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"    getter user : \n{{ user_class }}\n, resource : \n{{ resource_class }}\n\n\n    def initialize(@user, @resource)\n    \nend\n  \n"}},{"id":"pre_check(*methods)-macro","html_id":"pre_check(*methods)-macro","name":"pre_check","doc":null,"summary":null,"abstract":false,"args":[{"name":"methods","doc":null,"default_value":"","external_name":"methods","restriction":""}],"args_string":"(*methods)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/definition.cr#L9","def":{"name":"pre_check","args":[{"name":"methods","doc":null,"default_value":"","external_name":"methods","restriction":""}],"double_splat":null,"splat_index":0,"block_arg":null,"visibility":"Public","body":"    \n{% for method in methods %}\n      {% PRE_CHECKS << method.id.stringify %}\n    {% end %}\n\n  \n"}}],"types":[]},{"html_id":"github.com/imdrasil/sage/Sage/Policy/Finder","path":"Sage/Policy/Finder.html","kind":"class","full_name":"Sage::Policy::Finder","name":"Finder","abstract":true,"superclass":{"html_id":"github.com/imdrasil/sage/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"github.com/imdrasil/sage/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/imdrasil/sage/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"sage/policy/finder.cr","line_number":3,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/finder.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/imdrasil/sage/Sage/Policy","kind":"module","full_name":"Sage::Policy","name":"Policy"},"doc":null,"summary":null,"class_methods":[{"id":"policy(user,resource:T)forallT-class-method","html_id":"policy(user,resource:T)forallT-class-method","name":"policy","doc":null,"summary":null,"abstract":false,"args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":""},{"name":"resource","doc":null,"default_value":"","external_name":"resource","restriction":"T"}],"args_string":"(user, resource : T) forall T","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/finder.cr#L4","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/policy/finder.cr#L4","def":{"name":"policy","args":[{"name":"user","doc":null,"default_value":"","external_name":"user","restriction":""},{"name":"resource","doc":null,"default_value":"","external_name":"resource","restriction":"T"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"{% if true %}\n          {{ \"#{T}Policy\".id }}.new(user, resource)\n        {% end %}"}}],"constructors":[],"instance_methods":[],"macros":[],"types":[]}]},{"html_id":"github.com/imdrasil/sage/Sage/UnauthorizedError","path":"Sage/UnauthorizedError.html","kind":"class","full_name":"Sage::UnauthorizedError","name":"UnauthorizedError","abstract":false,"superclass":{"html_id":"github.com/imdrasil/sage/Exception","kind":"class","full_name":"Exception","name":"Exception"},"ancestors":[{"html_id":"github.com/imdrasil/sage/Exception","kind":"class","full_name":"Exception","name":"Exception"},{"html_id":"github.com/imdrasil/sage/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"github.com/imdrasil/sage/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"sage/exceptions.cr","line_number":2,"url":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/exceptions.cr"}],"repository_name":"github.com/imdrasil/sage","program":false,"enum":false,"alias":false,"aliased":"","const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":{"html_id":"github.com/imdrasil/sage/Sage","kind":"module","full_name":"Sage","name":"Sage"},"doc":null,"summary":null,"class_methods":[],"constructors":[{"id":"new(message:Nil,action:Symbol)-class-method","html_id":"new(message:Nil,action:Symbol)-class-method","name":"new","doc":null,"summary":null,"abstract":false,"args":[{"name":"message","doc":null,"default_value":"","external_name":"message","restriction":"Nil"},{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"}],"args_string":"(message : Nil, action : Symbol)","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/exceptions.cr#L3","source_link":"https://github.com/imdrasil/sage/blob/67dbc26a79c3fbf0e643a8a4ca520a00e5efb78c/src/sage/exceptions.cr#L3","def":{"name":"new","args":[{"name":"message","doc":null,"default_value":"","external_name":"message","restriction":"Nil"},{"name":"action","doc":null,"default_value":"","external_name":"action","restriction":"Symbol"}],"double_splat":null,"splat_index":null,"yields":null,"block_arg":null,"return_type":"","visibility":"Public","body":"_ = allocate\n_.initialize(message, action)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[],"macros":[],"types":[]}]}]}})