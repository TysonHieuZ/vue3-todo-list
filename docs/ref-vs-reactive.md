# ref<Todo[]> va so sanh ref/reactive

## ref<Todo[]> la gi?

`ref<Todo[]>([])` tao mot bien reactive co kieu du lieu la mang `Todo`. Khi dung trong `<script setup>`, can truy cap bang `.value`, vi du `todoList.value`. Khi dung trong template Vue, Vue tu dong unwrap nen co the viet truc tiep `todoList`.

Trong project nay, `todoList` nen dung `ref<Todo[]>` vi danh sach todo thuong duoc thay the ca mang khi xoa/sua va can khai bao type ro rang cho tung phan tu.

## ref va reactive

| Tieu chi | ref | reactive |
| --- | --- | --- |
| Phu hop voi | Primitive, array, object can thay ca gia tri | Object/array phuc tap va muon thao tac truc tiep tren field |
| Cach truy cap trong script | `count.value`, `todoList.value` | `state.count`, `state.todos` |
| Thay ca gia tri | Tot, gan lai `.value = ...` | Khong nen gan lai bien reactive truc tiep |
| TypeScript | De khai bao generic nhu `ref<Todo[]>([])` | Tot cho object co interface |
| Template | Tu dong unwrap | Dung truc tiep |

## Ket luan nhanh

- Dung `ref` khi can quan ly mot gia tri rieng le, mang, hoac co kha nang thay ca gia tri.
- Dung `reactive` khi can gom nhieu field vao mot object state va chi cap nhat cac field ben trong.
- Trong project nay: `todoList` dung `ref<Todo[]>`, con menu trong `App.vue` co the dung `reactive<MenuItem[]>` vi la mot cau truc UI co nhieu field long nhau.
