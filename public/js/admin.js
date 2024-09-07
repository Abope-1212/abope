const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  //   const csrf = btn.parantNode.querySelector("[name=_csrfId]").value;

  const productElement = btn.closest("article");
  fetch("/product/" + prodId, {
    method: "DELETE",
    // headers: {
    //     'csrf-token': csrf
    // }
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
document.addEventListener('DOMContentLoaded', function() {
  const deleteProduct  = document.getElementById('myButton');
  button.addEventListener('click', handleClick);
});

function handleClick() {
  alert('Button clicked!');
}