# Vex

## Nedir
Vex global verilerinizi verb uygulamanızda tutabileceğiniz ve bunları tek bir merkezden yönetebileceğiniz bir yapıdır, "global store managment" olarak geçen bu kavramın verb.js de olması büyük katkı sağlamaktadır, bu sayede uygulamanızın çoğunlukla kullandığı değerleri tek bir yerden yönetim değişimleri rahatça yapabilirsiniz.

## Hakkında
Vex bir derleme işlemi yapmaz, vex yanlızca kendisine "use" edilmiş verb ü veya verb bileşenlerinin "$update" methodunu çalıştırır, bu sayede derlemeleri bileşenler ve verb yapar, güncellemeyi yanlızca vex işler.

## structor
Vex bir class dır, yanlızca bir parameter alır, bu parametre bir obje olmalıdır, içerisinde "state" ve "actions" değerleri bulunmalıdır, bu değerler de birer obje olmalıdır.

#### state
Global olarak kullanılacak değerler bu objede tutulur.

#### actions
Global olarak değişim ve işlem yapacak metholar burada bulunur.

## Example

```html
<body>
  <template>
    <h1> {{ $store.state.title }} </h1>

    <button onclick="$store.actions.setTitle()"> Set Title </button>
  </template>
</body>

<script>
import { Verb, Vex } from './verb/distribution.js'

window.$store = new Vex({
  state: {
    title: 'Hello JavaScript'
  },
  actions: {
    setTitle() {
      $store.state.title = 'Hello Verb'
    }
  }
})

const app = new Verb()

// Use vex values ​​verb or components must be "$use" to "$store"
$store.$use(app)
</script>
```