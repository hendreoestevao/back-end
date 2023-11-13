import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
import cors from "cors"

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

// Configuração do CORS
app.use(cors())

let authToken = ""
const todoList = []

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const response = await axios.post(
      "https://biz24mctej.us-east-1.awsapprunner.com/api/Auth",
      { username, password },
    )
    console.log("Logado com Sucesso")
    authToken = response.data.token // Atribua o token à variável global
    res.json(response.data)
  } catch (error) {
    console.log("Error: ", error)
    console.log("Erro ao logar com Sucesso")
  }
})

app.post("/register", async (req, res) => {
  const { username, password, name } = req.body

  try {
    const response = await axios.post(
      "https://biz24mctej.us-east-1.awsapprunner.com/api/Auth/SignIn",
      { username, password, name },
      {
        headers: {
          "Access-Control-Allow-Origin": "*/*",
          "Content-Type": "application/json",
        },
      },
    )
    console.log("Usuario Criado com sucesso")
    res.json(response.data)
  } catch (error) {
    console.log("Error: ", error)
    console.log("Erro ao se  registrar")
  }
})

app.post("/api/ToDo", async (req, res) => {
  const { title, description } = req.body

  try {
    const response = await axios.post(
      "https://biz24mctej.us-east-1.awsapprunner.com/api/ToDo",
      { title, description },
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    const newItem = response.data
    todoList.push(newItem)

    res.json(newItem)
    console.log("Tarefa Criada com Sucesso")
  } catch (error) {
    console.log("Error: ", error)
    console.log("Erro ao  Criar tarefa")
  }
})

app.get("/api/ToDo", async (req, res) => {
  try {
    const response = await axios.get(
      "https://biz24mctej.us-east-1.awsapprunner.com/api/ToDo",
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
    console.log("Tarefa mostrada com  sucesso")
    res.json(response.data)
  } catch (error) {
    console.log("Error: ", error)
    console.log("Erro ao  mostrar Tarefa")
  }
})

app.delete("/api/ToDo/:id", async (req, res) => {
  const itemId = req.params.id

  try {
    const response = await axios.delete(
      `https://biz24mctej.us-east-1.awsapprunner.com/api/ToDo/${itemId}`,
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    res.json(response.data)
    console.log("Tarefa  Deletada com Sucesso")
  } catch (error) {
    console.log("Error: ", error)
    console.log("Erro ao deletar tarefa")
  }
})

app.get("/api/ToDo/MarkAsDone/:id", async (req, res) => {
  const itemId = req.params.id

  try {
    const response = await axios.get(
      `https://biz24mctej.us-east-1.awsapprunner.com/api/ToDo/MarkAsDone/${itemId}`,
      {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    const markedAsDoneItem = response.data

    // Aqui você pode processar a tarefa marcada como concluída conforme necessário
    console.log("Tarefa Marcada como Concluída:", markedAsDoneItem)

    res.json(markedAsDoneItem)
  } catch (error) {
    console.log("Error: ", error)
    console.log("Erro ao marcar Tarefa Marcada como Concluída")
  }
})

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`)
})
