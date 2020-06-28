import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Base64 } from 'js-base64'

import {
  Button,
  DataTable,
  Link,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  Form,
  FormGroup,
  TextInput,
  TextArea
} from 'carbon-components-react'

type LinkType = {
  pk: number
  title: string
  link: string
  date_added: string
  linklist: number
}

enum AppDisplayModes {
  'linkTable',
  'linkForm',
  'loginForm'
}

enum LinkAttributes {
  'title',
  'link',
  'date_added'
}

enum LoginAttributes {
  'user',
  'password'
}

class App extends React.Component<
  {},
  {
    display: AppDisplayModes
    links: LinkType[]
    newLink?: LinkType
    user: string
    password: string
    loginAttempt: boolean
  }
> {
  constructor(props: any) {
    super(props)

    this.getListFromDB()

    this.state = {
      display: AppDisplayModes.loginForm,
      links: [],
      user: '',
      password: '',
      loginAttempt: false
    }
  }

  private getListFromDB = () => {
    fetch('http://127.0.0.1:8000/linklist/20/')
      .then((r) => r.json())
      .then((data) => {
        this.setState({
          links: data
        })
      })
  }

  private displayTable = (e: any) => {
    this.setState({
      display: AppDisplayModes.linkTable,
      newLink: undefined
    })
  }

  private displayLinkForm = (e: any) => {
    this.setState({
      display: AppDisplayModes.linkForm,
      newLink: {
        pk: -1,
        title: '',
        link: '',
        date_added: '',
        linklist: -1
      }
    })
  }

  private addNewLinkHandler = (e: any) => {
    e.preventDefault()

    fetch('http://127.0.0.1:8000/linklist/20/', {
      headers: {
        Authorization: `Basic ${Base64.encode(`${this.state.user}:${this.state.password}`)}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ ...this.state.newLink, linklist: 20 })
    }).then((r) => {
      if (r.status === 201) {
        const newLinks = this.state.links
        newLinks.push(this.state.newLink as LinkType)

        this.setState({
          display: AppDisplayModes.linkTable,
          links: newLinks,
          newLink: undefined
        })
      } else {
        console.log(r.status, r.statusText, r.json())
      }
    })
  }

  private loginHandler = (e: any) => {
    e.preventDefault()

    // TODO: Check database to see if correct user/password
    if (true) {
      this.setState({
        display: AppDisplayModes.linkTable,
        user: 'admin',
        password: '123passwd123'
      })
    } else {
      console.log('Incorrect password')

      this.setState({
        loginAttempt: true
      })
    }
  }

  private editAttributeHandler = (e: any, attribute: LinkAttributes) => {
    const newLink = this.state.newLink as LinkType

    switch (attribute) {
      case LinkAttributes.title:
        newLink.title = e.target.value

        break

      case LinkAttributes.link:
        newLink.link = e.target.value

        break

      case LinkAttributes.date_added:
        newLink.date_added = e.target.value

        break
    }

    this.setState({
      newLink
    })
  }

  private editLoginHandler = (e: any, attribute: LoginAttributes) => {
    let {user, password} = this.state

    switch (attribute) {
      case LoginAttributes.user:
        user = e.target.value

        break

      case LoginAttributes.password:
        password = e.target.value

        break
    }

    this.setState({
      user, password
    })
  }

  render() {
    const rowData: {
      id: string
      title: string
      link: string
      date_added: string
    }[] = []

    this.state.links.forEach((link) => {
      rowData.push({ ...link, id: rowData.length.toString() })
    })

    switch (this.state.display) {
      case AppDisplayModes.linkTable:
        return (
          <div>
            <DataTable
              rows={rowData}
              headers={[
                {
                  header: 'Title',
                  key: 'title'
                },
                {
                  header: 'Link',
                  key: 'link'
                },
                {
                  header: 'Date Added',
                  key: 'date_added'
                }
              ]}
              render={({ rows, headers, getHeaderProps }) => (
                <TableContainer title="DataTable">
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell) => {
                            switch (cell.info.header) {
                              case 'link':
                                return (
                                  <TableCell key={cell.id}>
                                    <Link href={cell.value}>{cell.value}</Link>
                                  </TableCell>
                                )

                              default:
                                return (
                                  <TableCell key={cell.id}>
                                    {cell.value}
                                  </TableCell>
                                )
                            }
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            />

            <Button onClick={this.displayLinkForm}>Add new link</Button>
          </div>
        )

      case AppDisplayModes.linkForm:
        return (
          <Form onSubmit={this.addNewLinkHandler}>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="titleInput"
                invalidText="Invalid error message."
                labelText="Title"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.editAttributeHandler(e, LinkAttributes.title)
                }}
              />
            </FormGroup>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="linkInput"
                invalidText="Invalid error message."
                labelText="Link"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.editAttributeHandler(e, LinkAttributes.link)
                }}
              />
            </FormGroup>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="dateInput"
                invalidText="Invalid error message."
                labelText="Date"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.editAttributeHandler(e, LinkAttributes.date_added)
                }}
              />
            </FormGroup>
            <Button kind="primary" tabIndex={0} type="submit">
              Submit
            </Button>
            <Button onClick={this.displayTable} kind="primary" tabIndex={0}>
              Back
            </Button>
          </Form>
        )

      case AppDisplayModes.loginForm:
        return (
          <Form onSubmit={this.loginHandler}>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="linkInput"
                invalidText="Invalid error message."
                labelText="User"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.editLoginHandler(e, LoginAttributes.user)
                }}
              />
            </FormGroup>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="dateInput"
                invalid={this.state.loginAttempt}
                invalidText="Incorrect password"
                labelText="Password"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.editLoginHandler(e, LoginAttributes.password)
                }}
              />
            </FormGroup>
            <Button kind="primary" tabIndex={0} type="submit">
              Submit
            </Button>
          </Form>
        )
    }
  }
}

export default App
