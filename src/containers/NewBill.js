import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
  // handleChangeFile = e => {
  //   e.preventDefault()
  //   const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
  //   console.log(file.name);
  //   this.fileName = file.name
  //   // if (file) {
  //   //   if (file.type !== "image/png" && file.type !== "image/jpeg") {
  //   //     alert("Seuls les fichiers PNG et JPG sont autorisés.");
  //   //     return; // Arrêtez l'exécution de la fonction si le fichier n'est pas PNG ou JPG.
  //   //   }
  //   //   // Si le fichier est au format PNG ou JPG, vous pouvez l'ajouter à formData et continuer avec l'envoi de la requête.
  //   //   const filePath = e.target.value.split(/\\/g)
  //   // const fileName = filePath[filePath.length-1]
  //   // const formData = new FormData()
  //   // const email = JSON.parse(localStorage.getItem("user")).email
  //   // formData.append('file', file)
  //   // formData.append('email', email)
  //   // } else {
  //   //   alert("Aucun fichier sélectionné.");
  //   // }
  //   const filePath = e.target.value.split(/\\/g)
  //   const fileName = filePath[filePath.length-1]
  //   const formData = new FormData()
  //   const email = JSON.parse(localStorage.getItem("user")).email
  //   formData.append('file', file)
  //   formData.append('email', email)

  //   this.store
  //     .bills()
  //     .create({
  //       data: formData,
  //       headers: {
  //         noContentType: true
  //       }
  //     })
  //     .then(({fileUrl, key}) => {
  //       console.log(fileUrl)
  //       this.billId = key
  //       this.fileUrl = fileUrl
  //       console.log(this.fileUrl);
  //       this.fileName = fileName
  //     }).catch(error => console.error(error))
  // }
  handleChangeFile = e => {
    e.preventDefault();
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];

    if (file) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();

      if (!allowedExtensions.includes(fileExtension)) {
        alert("Seuls les fichiers JPG, JPEG et PNG sont autorisés.");
        fileInput.value = ""; // Effacez la sélection du fichier
        return; // Arrêtez l'exécution de la fonction si l'extension n'est pas autorisée.
      }

      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append('file', file);
      formData.append('email', email);
      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true
          }
        })
        .then(({ fileUrl, key }) => {
          console.log(fileUrl);
          this.billId = key;
          this.fileUrl = fileUrl;
          this.fileName = fileName;
        })
        .catch(error => console.error(error));
    } else {
      alert("Aucun fichier sélectionné.");
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}