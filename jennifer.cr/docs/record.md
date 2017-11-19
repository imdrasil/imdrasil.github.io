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
# Record

There are 2 types of query classes:
- `Jennifer::QueryBuilder::Query` - general class which allows to generate request to any table
- `Jennifer::QueryBuilder::ModelQuery(T)` - specific query for model `T`.

First one gets db result set and converts it to the hash which is wraped by `Jennifer::Record` structure. This structure allows get field using a method call:

```crystal
record = Jennifer::QueryBuilder::Query["contacts"].where { _name.like("Jho%") }.to_a[0]

record["name"] 						# Jennifer::DBAny
record.attribute("name") 		 	# Jennifer::DBAny
record.attribute("name", String) 	# String or raises Jennifer::BaseException
record.name 					 	# Jennifer::DBAny
record.name(String) 				# Jennifer::DBAny
```

Be carefull with `#{{attribute_name}}` methods are generated using macros. 

In major amount of cases you will use second one which will return `Array(T)`. But also with custom selects or unions `Jennifer::Record` could be retrieved using `#results`:

```crystal
Contact.all.select { [_name, _id] }.results # Jennifer::DBAny
```{% endraw %}