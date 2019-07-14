departments
  get /departments
  get /departments/{department_id}

  Department{
    department_id	integer
    example: 1
    name	string
    example: Regional
    description	string
    example: Proud of your country? Wear a T-shirt with a national symbol stamp!
  }


categories
  get /categories
  get /categories/{category_id}
  get /categories/inProduct/{product_id}
  get /categories/inDepartment/{department_id}

  Category{
  category_id	integer
  example: 1
  name	string
  example: French
  description	string
  example: The French have always had an eye for beauty. One look at the T-shirts below and you'll see that same appreciation has been applied abundantly to their postage stamps. Below are some of our most beautiful and colorful T-shirts, so browse away! And don't forget to go all the way to the bottom - you don't want to miss any of them!
  department_id	integer
  example: 1
  }


attributes
  get /attributes
  get /attributes/{attribute_id}
  get /attributes/values/{attribute_id}
  get attributes/inProduct/{product_id}


products
  get /products
  get /products/search
  get /products/{product_id}
  get /products/inCategory/{category_id}
  get /products/inDepartment/{department_id}
  get /products{producdt_id}/details
  get /products/{product_id}/locations
  get /products/{product_id}/reviews
  post /products/{product_id}/reviews

  model
  {
    product_id	integer
    example: 2
    name"	string
    example: Chartres Cathedral
    description	string
    example: "The Fur Merchants". Not all the beautiful stained glass in the great cathedrals depicts saints and angels! Lay aside your furs for the summer and wear this beautiful T-shirt!
    price	string
    example: 16.95
    discounted_price	string
    example: 15.95
    image	string
    example: chartres-cathedral.gif
    image2	string
    example: chartres-cathedral2.gif
    thumbnail	string
    example: chartres-cathedral-thumbnail.gif
    display	integer
    example: 0
    }

    Review{
      name	string
      example: Eder Taveira
      review	string
      example: That's a good product. The best for me.
      rating	integer
      example: 5
      created_on	string
      example: 2019-02-17 13:57:29
    }



customers
  put /customer
  get /customer
  post /customers register a customer
  post /customers/login sign in the shopping
  post /customers/facebook sign in with a facebook logn token
  put /customers/address update the address from customer
  put /customers/creditCard update the credit card from customer
  Customer{
      customer_id	integer
      name	string
      email	string
      address_1	string
      address_2	string
      city	string
      region	string
      postal_code	string
      country	string
      shipping_region_id	integer
      day_phone	string
      example: +351323213511235
      example: +452436143246123
      mob_phone	string
      credit_card	string
  }


Orders
  post /orders
  get /orders/{order_id}
  get /orders/inCustomer get order by customer
  get /order/shortDetail/{order_id}

shoppingcart
  get /shoppingcart/generateUniqueId
  post /shoppingcart/add
  get /shoppingcart/{cart_id}
  put /shoppingcart/update/{item_id}
  delete /shoppingcart/empty/{cart_id}
  get /shoppingcart/moveToCart/{item_id}
  get shoppingcart/totalAmount/{cart_id}
  get /shoppingcart/saveForLater/{item_id}
  get /shoppingcart/getSaved/{cart_id}
  delete /shoppingcart/removeProduct/{item_id}

  Cart{
  item_id	integer
  example: 2
  name	string
  example: Arc d'Triomphe
  attributes	string
  example: LG, red
  product_id	number
  example: 1
  price	string
  example: 14.99
  quantity	integer
  example: 1
  subtotal	string
  example: 14.99
  }

tax
  get /tax
  get /tax/{tax_id}

shipping
  get /shipping/regions
  get /shipping/regions/{shipping_region_id}

stripe
  post /stripe/charge
  post /stripe/webhooks
