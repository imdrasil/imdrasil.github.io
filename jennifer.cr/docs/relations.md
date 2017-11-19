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
# Relations

There are 4 types of relations: `has_many`, `has_and_belongs_to_many`, `belongs_to` and `has_one`. All of them have same semantic but generate slightly different methods.

They takes next arguments:

- `name` - relation name
- `klass` - target class
- `request` - additional request (will be used inside of where clause) - optional
- `foreign` - name of foreign key - optional; by default use singularized table name + "_id"
- `primary` - primary field name - optional;  by default it uses default primary field of class.

has_and_belongs_to_many also accepts extra 2 arguments and use regular arguments slightly in another way:
- `join_table` - join table name; be default relation table names in alphabetic order joined by underscore is used
- `join_foreign` - foreign key for current model (left foreign key of join table)
- `foreign` - used as right foreign key
- `primary` - used as primary field of current table; for now it properly works only if both models in this relation has primary field named `id`

All relation macroses provide next methods:

- `#{{relation_name}}` - cache relation object (or array of them) and returns it;
- `#{{relation_name}}_reload` - reload relation and returns it;
- `#{{relation_name}}_query` - returns query which is used to get objects of this object relation entities form db.
- `#remove_{{relation_name}}` - removes given object from relation
- `#add_{{relation_name}}` - adds given object to relation or builds it from has and adds

This allows dynamically adds objects to relations with automatically setting foreign id:

```crystal
contact = Contact.all.find!
contact.add_addresses({:main => true, :street => "some street", :details => nil})

address = contact.addresses.last
contact.remove_addresses(address)
```

`belongs_to` and `has_one` add extra method `#relation_name!` which also adds assertion for `nil` inside of it.

`%has_and_belongs_to_many` relation allows to define many-to-many relationship between 2 models. By given parameters could be specified field names described on the next schema:
```
| "Model A" |   | "Join Table" (join_table) |		| "Model B" 			  |
| --------- |	|---------------------------|		|-------------------------|
| primary 	|<--| foreign 					|   /-->| "model b primary field" |
				| association_foreign		|--/
```

As you can see primary field of related model can't be specified - defined primary key (in the mapping) will be got.

Also `mas_many`, `belongs_to` and `has_one` relations have `dependent` parameter - defines extra callback for cleaning up related data after destroying parent one. Allowed types are:
- `nullify` - sets foreign key to `null` (`belongs_to` doesn't support it) - default for `has_many` and `has_one`
- `delete` - deletes all related objects
- `destroy` - destroyes all related objects
- `restrict_with_exception` - will raise `Jennifer::RecordExists` exception if there is any related object
- `none` - will do nothing - default for `belongs_to`

#### Inverse of

`has_many` and `has_one` relations also accepts `inverse_of` option which represents inverse relation name. Specifying this option will automatically load owner object during any relation loading (because of `ModelQuery#includes` or `ModelQuery#eager_load` or even plaint `SomeModel#relation_name` mathod call) {% endraw %}