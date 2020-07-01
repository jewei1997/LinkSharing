import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Base64 } from 'js-base64'

// @ts-ignore
import { TrashCan20, Search20, Notification20, AppSwitcher20 } from '@carbon/icons-react'

// @ts-ignore
import { default as dt } from "py-datetime";

import {
  Button,
  Content,
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
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Header,
  SideNav,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react'

type LinkType = {
  pk: number
  title: string
  link: string
  date_added: string
  linklist: number
}

type LinkListType = {
  pk: number
  title: string
  date_created: string
  owner: string
}

type RowData = LinkType & {
    id: string;
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

const missingListPkError = new Error('No link list pk')

class App extends React.Component<
  {},
  {
    display: AppDisplayModes
    links: LinkType[]
    selectedLinkList?: LinkListType,
    linkLists: LinkListType[]
    newLink?: LinkType
    user: string
    password: string
    loginAttempt: boolean
  }
> {
  constructor(props: any) {
    super(props)

    // this.getListFromDB()

    this.state = {
      display: AppDisplayModes.loginForm,
      links: [],
      selectedLinkList: undefined,
      linkLists: [],
      user: '',
      password: '',
      loginAttempt: false
    }
  }

  private getListFromDB = (linkListPk: number) => {
    if (linkListPk && linkListPk > 0) {
      fetch(`http://127.0.0.1:8000/linklist/${linkListPk}/`)
      .then((r) => r.json())
      .then((data) => {
        this.setState({
          links: data
        })
      })
    } else {
      throw missingListPkError
    }
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

  private selectListHandler = (e: any, linkList: LinkListType) => {
    this.getListFromDB(linkList.pk)

    this.setState({
      selectedLinkList: linkList
    })
  }

  private addNewLinkHandler = (e: any, linkListPk: number) => {
    e.preventDefault()
    
    const newLink = { ...this.state.newLink, date_added: dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), linklist: 20 }

    if (linkListPk && linkListPk > 0) {
      fetch(`http://127.0.0.1:8000/linklist/${linkListPk}/`, {
        headers: {
          Authorization: `Basic ${Base64.encode(`${this.state.user}:${this.state.password}`)}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(newLink)
      }).then((r) => {
        if (200 <= r.status && r.status < 300) {
          const newLinks = this.state.links
          newLinks.push(newLink as LinkType)
  
          this.setState({
            display: AppDisplayModes.linkTable,
            links: newLinks,
            newLink: undefined
          })
        } else {
          console.log('Add link error', r.status, r.statusText)
        }
      })
    } else {
      throw missingListPkError
    }
  }

  private deleteLinkHander = (e: any, linkPk: number, linkListPk: number) => {
    if (linkListPk && linkListPk > 0) {
      fetch(`http://127.0.0.1:8000/linklist/${linkListPk}/`, {
        headers: {
          Authorization: `Basic ${Base64.encode(`${this.state.user}:${this.state.password}`)}`,
          "Content-Type": "application/json",
        },
        method: 'DELETE',
        body: JSON.stringify({ pk: linkPk })
      }).then(r => {
        if (200 <= r.status && r.status < 300) {
          const newLinks = this.state.links
          const newLinksFiltered = newLinks.filter(link => link.pk !== linkPk)
  
          this.setState({
            display: AppDisplayModes.linkTable,
            links: newLinksFiltered,
            newLink: undefined
          })
        }
        console.log('Delete link', r.status, r.statusText)
      })
    } else {
      throw missingListPkError
    }
  }

  private loginHandler = (e: any) => {
    e.preventDefault()

    // TODO: Check database to see if correct user/password
    if (true) {
      fetch('http://127.0.0.1:8000/linklist/')
      .then(r => {
        if (200 <= r.status && r.status < 300) {
          return r.json()
        }
      }).then(data => {
          if ((data as LinkListType[]).length > 0) {
            this.setState({
              display: AppDisplayModes.linkTable,
              selectedLinkList: data[0],
              linkLists: data,
              user: 'admin',
              password: '123passwd123'
            })
          } else {
            throw new Error(`User has no link lists`)
          }
      }) // TODO: add catch
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
    const rowData: RowData[] = []

    this.state.links.forEach((link) => {
      rowData.push({ ...link, id: rowData.length.toString() })
    })

    const linkListPk = this.state.selectedLinkList ? this.state.selectedLinkList.pk : -1

    return (
      <div>
        <Header aria-label="IBM Platform Name">
          <HeaderName href="#" prefix="IBM">
            [Platform]
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
              <Search20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="Notifications" onClick={() => {}}>
              <Notification20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label="App Switcher" onClick={() => {}}>
              <AppSwitcher20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>
        <SideNav
          isFixedNav
          expanded={true}
          isChildOfHeader={false}
          aria-label="Side navigation"
        >
          <SideNavItems>
            {
              this.state.linkLists.map(linkList => (
                <div onClick={ (e) => { this.selectListHandler(e, linkList) }}>
                  <SideNavLink>{linkList.title}</SideNavLink> 
                </div>
              ))
            }
          </SideNavItems>
        </SideNav>
        <Content>
          {
            (() => {
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
                          },
                          {
                            header: '',
                            key: 'deleteLink'
                          }
                        ]}
                        render={({ rows, headers, getHeaderProps }) => (
                          <TableContainer title={this.state.selectedLinkList?.title}>
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
                                        case 'date_added':
                                          return (
                                            <TableCell key={cell.id}>
                                              {(cell.value as string).substring(0,10)} 
                                            </TableCell>
                                          )

                                        case 'deleteLink':
                                          const row = rowData.find(row => row.id === cell.id.split(':')[0]) as RowData

                                          return (
                                            <TableCell key={cell.id}>
                                              <div
                                                className="clickableicon"
                                                onClick={(e) => this.deleteLinkHander(e, row.pk, linkListPk)}
                                              >
                                                <TrashCan20 />
                                              </div>
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
                    <Form onSubmit={ (e) => { this.addNewLinkHandler(e, linkListPk) }}>
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
            })()
          }
        </Content>
      </div>
    )
  }
}

export default App