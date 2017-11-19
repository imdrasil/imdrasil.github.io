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
# Aggregations

There are 2 types of aggregation functions: ones which are orking without GROUP clause and returns single values (e.g. `max`, `min`, `count`) and ones, working with GROUP clause and returning array of values.

#### Max

```crystal
Contact.all.max(:name, String)
```

#### Min

```crystal
Contact.all.min(:age, Int32)
```

#### Avg

```crystal
Contact.all.avg(:age, Float64) # mysql specific
Contact.all.avg(:age, PG::Numeric) # Postgres specific
```

#### Sum

```crystal
Contact.all.sum(:age, Float64) # mysql specific
Contact.all.sum(:age, Int64) # postgres specific
```

#### Count

```crystal
Contact.all.count
```

#### Group Max

```crystal
Contact.all.group(:gender).group_max(:age, Int32)
```

#### Group Min

```crystal
Contact.all.group(:gender).group_min(:age, Int32)
```

#### Group Avg

```crystal
Contact.all.group(:gender).group_avg(:age, Float64) # mysql specific
Contact.all.group(:gender).group_avg(:age, PG::Numeric) # Postgres specific
```

#### Group Sum

```crystal
Contact.all.group(:gender).group_sum(:age, Float64) # mysql specific
Contact.all.group(:gender).group_sum(:age, Int64) # postgres specific
``` 

#### Group Count

```crystal
Contact.all.group(:gender).group_count(:age)
```
{% endraw %}