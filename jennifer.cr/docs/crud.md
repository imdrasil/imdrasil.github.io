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
# CRUD

#### Create

To create new object there are several ways:

- create it passing arguments to `#create` method

```crystal
Contact.create(name: "John", age: 18)
```

- building it and saving manually

```crystal
c = Contact.build({:name => "Horus", :age => 4000})
c.age = 18
c.save
```

> Any `::create` and `#save` method call by default process under a transation. If transation is already started will not create new one.

To insert multiple records at once use `::import`:

```crystal
objects = [Contact.new({name: "Tom", age: 18}), Contact.new({name: "Jerry", age: 16})]
Contact.import(objects)
```

#### Read

Object could be retrieved by id using `#find` (returns `T?`) and `#find!` (returns `T` or raise `RecordNotFound` exception) methods.

```crystal
Contact.find!(1)
```

Also there is flexible dsl for building queries.

To reload all fields from db use `#reload`

```crystal
c1 = Contact.create(name: "Sam", age: 25)
Contact.where { _id == c1.id }.update(age: 30)
c1.reload
puts c1.age # 30
```

#### Update

There are several ways which allows to update object. Some of them were mentioned in mapping section. There are few extra methods to do this:
- `#update_column(name, value)` - sets directly attribute and store it to db without any callback
- `#update_columns(values)` - same for several ones
- `#update_attributes(values)` - just set attributes
- `#set_attribute(name, value)` - set attribute by given name

You can provide hash or named tuple with new field values to update all records satisfying given conditions:
```crystal
Contact.all.update(age: 1, name: "Wonder")
```

Will not trigger any callback.

Also relative modification allowed as well:

```crystal
# UPDATE contacts SET age = age + 2 WHERE id = 12
Contact.where { _id == 12 }.increment(age: 2)
```

#### Destroy

To destroy object use `#delete` (is called without callbacks) or `#destroy`. To destroy several objects by their ids use class method:

```crystal
ids = [1, 20, 18]
Contact.destroy(ids)
Address.delete(1)
Country.delete(1,2,3)
```

To stop deleting from a callback just add some error:

```crystal
class MyModel < Jennifer::Model::Base
  mapping(
  # ...
  )
  before_destroy :check

  def check
    if some_field > 10
     errors.add(:some_field, "Can't be deleted")
    end
  end
end
```
> Any `#destroy` method call as well as `#save` use a transaction.

##### Truncation

To truncate entire table use:
```crystal
Jennifer::Adapter.adapter.truncate("contacts")
# or
Jennifer::Adapter.adapter.truncate(Contact)
```

This functionality could be useful to clear db between test cases.
{% endraw %}