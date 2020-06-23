import React from 'react'

import { Button, DataTable, Link, TableContainer, Table, TableBody, TableHead, TableRow, TableHeader, TableCell, Form, FormGroup, TextInput, TextArea } from 'carbon-components-react'

type LinkType = {
  link: string
  date: string
  comment: string
}

enum AppDisplayModes {
  'linkTable',
  'linkForm',
  'loginForm'
}

enum LinkAttributes {
  'link',
  'date',
  'comment'
}

enum LoginAttributes {
  'user',
  'password'
}

class App extends React.Component<{}, {
  display: AppDisplayModes
  links: LinkType[]
  newLink?: LinkType
  currentUser: {
    user: string
    password: string
  }
  loginAttempt: boolean
}> {
  constructor(props: any) {
    super(props)

    // TODO: get links
    const links = [
      {
        link: "facebook.com",
        date: "1995-12-17T03:24:00",
        comment: "This website is the color blue"
      },
      {
        link: "google.com",
        date: "1995-12-17T03:24:00",
        comment: "Wow, this website lets your search for stuff"
      },
      {
        link: "reddit.com",
        date: "1995-12-17T03:24:00",
        comment: "I love reading stuff. Have you read it?"
      },
      {
        link: "twitter.com",
        date: "1995-12-17T03:24:00",
        comment: "Enter bird metaphor here"
      }
    ]

    this.state = {
      display: AppDisplayModes.loginForm,
      links,
      currentUser: {
        user: '',
        password: ''
      },
      loginAttempt: false
    }
  }

  private displayLinkForm = (e: any) => {
    this.setState({
      display: AppDisplayModes.linkForm,
      newLink: {
        link: '',
        date: '',
        comment: ''
      }
    })
  }

  private addNewLinkHandler = (e: any) => {
    e.preventDefault()

    const newLinks = this.state.links
    newLinks.push(this.state.newLink as LinkType)
    
    this.setState({
      display: AppDisplayModes.linkTable,
      links: newLinks,
      newLink: undefined
    }, () => {
      console.log(this.state)
    })
  }

  private loginHandler = (e: any) => {
    e.preventDefault()

    // TODO: Check database to see if correct user/password
    if (this.state.currentUser.user === 'admin' && this.state.currentUser.password === '123456') {
      this.setState({
        display: AppDisplayModes.linkTable
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

    switch(attribute) {
      case LinkAttributes.link:
        newLink.link = e.target.value

        break

    case LinkAttributes.date:
      newLink.date = e.target.value

      break

    case LinkAttributes.comment:
      newLink.comment = e.target.value

      break
    }

    this.setState({
      newLink
    })
  }

  private editLoginHandler = (e: any, attribute: LoginAttributes) => {
    const currentUser = this.state.currentUser

    switch(attribute) {
      case LoginAttributes.user:
        currentUser.user = e.target.value

        break

      case LoginAttributes.password:
        currentUser.password = e.target.value

        break
    }

    this.setState({
      currentUser
    })
  }

  render() {
    const rowData: {
      id: string
      link: string
      date: string
      comment: string
    }[] = []

    this.state.links.forEach(link => {
      rowData.push({ ...link, id: rowData.length.toString()})
    })

    switch(this.state.display) {
      case AppDisplayModes.linkTable:
        return (
          <div>
          <DataTable
            rows={rowData}
            headers={[
              {
                header: 'Link',
                key: 'link'
              },
              {
                header: 'Date',
                key: 'date'
              },
              {
                header: 'Comment',
                key: 'comment'
              }
            ]}
            render={({ rows, headers, getHeaderProps }) => (
            <TableContainer title="DataTable">
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {row.cells.map(cell => {
                        switch(cell.info.header) {
                          case 'link': 
                            return (
                              <TableCell key={cell.id}>
                                <Link href={cell.value}>{cell.value}</Link>
                              </TableCell>
                            )
                          
                          default:
                            return <TableCell key={cell.id}>{cell.value}</TableCell>
                        }
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>)}/>
    
            <Button onClick={this.displayLinkForm}>Add new link</Button>
          </div>
        )

      case AppDisplayModes.linkForm:
        return (
          <Form onSubmit={this.addNewLinkHandler}>
          <FormGroup legendText=''>
            <TextInput
              // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
              id="linkInput"
              invalidText="Invalid error message."
              labelText="Link"
              placeholder="Placeholder text"
              onChange={(e) => { this.editAttributeHandler(e, LinkAttributes.link) }}
            />
          </FormGroup>
          <FormGroup legendText=''>
            <TextInput
              // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
              id="dateInput"
              invalidText="Invalid error message."
              labelText="Date"
              placeholder="Placeholder text"
              onChange={(e) => { this.editAttributeHandler(e, LinkAttributes.date) }}
            />
          </FormGroup>
          <FormGroup legendText=''>
          <TextArea
            cols={50}
            // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
            id="commentInput"
            invalidText="Invalid error message."
            labelText="Comment"
            placeholder="Placeholder text"
            rows={4}
            onChange={(e) => { this.editAttributeHandler(e, LinkAttributes.comment) }}
            />
          </FormGroup>
          <Button
            kind="primary"
            tabIndex={0}
            type="submit"
          >
            Submit
          </Button>
        </Form>
        )

      case AppDisplayModes.loginForm:
        return (
          <Form onSubmit={this.loginHandler}>
          <FormGroup legendText=''>
            <TextInput
              // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
              id="linkInput"
              invalidText="Invalid error message."
              labelText="User"
              placeholder="Placeholder text"
              onChange={(e) => { this.editLoginHandler(e, LoginAttributes.user) }}
            />
          </FormGroup>
          <FormGroup legendText=''>
            <TextInput
              // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
              id="dateInput"
              invalid={this.state.loginAttempt}
              invalidText="Incorrect password"
              labelText="Password"
              placeholder="Placeholder text"
              onChange={(e) => { this.editLoginHandler(e, LoginAttributes.password) }}
            />
          </FormGroup>
          <Button
            kind="primary"
            tabIndex={0}
            type="submit"
          >
            Submit
          </Button>
        </Form>
        )
    }
  }
}

export default App;