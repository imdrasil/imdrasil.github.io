---
layout: page
---
<header class="site-header" role="banner">
  <div class="wrapper">
    <nav class="site-nav">
      <div class="trigger">
        
          <a class="page-link" href="./model_mapping">{{ "Mapping" | escape }}</a>
        
          <a class="page-link" href="./model_scopes">{{ "Scopes" | escape }}</a>
        
          <a class="page-link" href="./crud">{{ "CRUD" | escape }}</a>
        
          <a class="page-link" href="./query_dsl">{{ "Query DSL" | escape }}</a>
        
          <a class="page-link" href="./callbacks">{{ "Callbacks" | escape }}</a>
        
          <a class="page-link" href="./view">{{ "Views" | escape }}</a>
        
          <a class="page-link" href="./timestamps">{{ "Timestamps" | escape }}</a>
        
          <a class="page-link" href="./pagination_and_ordering">{{ "Pagination & Ordering" | escape }}</a>
        
          <a class="page-link" href="./configuration">{{ "Configuration" | escape }}</a>
        
          <a class="page-link" href="./aggregation">{{ "Aggregations" | escape }}</a>
        
          <a class="page-link" href="./relations">{{ "Relations" | escape }}</a>
        
          <a class="page-link" href="./validation">{{ "Validation" | escape }}</a>
        
          <a class="page-link" href="./record">{{ "Record" | escape }}</a>
        
          <a class="page-link" href="./migration">{{ "Migration" | escape }}</a>
        
          <a class="page-link" href="./eager_loading">{{ "Eager Loading" | escape }}</a>
        
          <a class="page-link" href="./model_sti">{{ "STI" | escape }}</a>
        
          <a class="page-link" href="./index">{{ "Jennifer Documentation" | escape }}</a>
        
          <a class="page-link" href="./transaction_and_lock">{{ "Transaction & Lock" | escape }}</a>
        
      </div>
    </nav>
  </div>
</header>
{% raw %}
# STI

Single table inheritance could be used in next way:
```crystal
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

class TwitterProfile < Profile
  sti_mapping(
    email: String
  )
end
```

Subclass extends superclass definition with new fields and use string fild `type` to indentify itself.

> Now `Profile.all` will return objects of `Profile` class not taking into account `type` field.
{% endraw %}