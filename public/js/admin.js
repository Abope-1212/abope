// const deleteProduct = (btn) => {
//   const prodId = btn.parentNode.querySelector("[name=productId]").value;
//   //   const csrf = btn.parantNode.querySelector("[name=_csrfId]").value;

//   const productElement = btn.closest("article");
//   fetch("/product/" + prodId, {
//     method: "DELETE",
//     // headers: {
//     //     'csrf-token': csrf
//     // }
//   })
//     .then((result) => {
//       return result.json();
//     })
//     .then((data) => {
//       console.log(data);
//       productElement.parentNode.removeChild(productElement);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// document.addEventListener('DOMContentLoaded', function() {
//   const deleteProduct  = document.getElementById('myButton');
//   button.addEventListener('click', handleClick);
// });

// function handleClick() {
//   alert('Button clicked!');
// }
document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const prodId = this.getAttribute("data-product-id");
    deleteProduct(prodId);
  });
});

function deleteProduct(prodId) {
  fetch("/product/" + prodId, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Remove the product from the DOM
    })
    .catch((err) => console.error(err));
}
