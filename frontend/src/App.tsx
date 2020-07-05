import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Base64 } from 'js-base64'

// @ts-ignore
import { TrashCan20, Search20, Notification20, AppSwitcher20 } from '@carbon/icons-react'

// @ts-ignore
import { default as dt } from "py-datetime";

// @ts-ignore
import queryString from 'query-string';

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
  'listForm',
  'loginForm'
}

enum LinkAttributes {
  'title' = 'title',
  'link' = 'link',
  'date_added' = 'date_added'
}

enum ListAttributes {
  'title',
  'date_created',
  'owner'
}

enum LoginAttributes {
  'user',
  'password'
}

const missingListPkError = new Error('No link list pk')

class AppHeader extends React.Component {
  render() {
    return (
      <Header aria-label="">
        <HeaderName href="#" prefix="LinkSharing">
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Search" onClick={() => { }}>
            <Search20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Notifications" onClick={() => { }}>
            <Notification20 />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="App Switcher" onClick={() => { }}>
            <AppSwitcher20 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    )
  }
}

type AppSideBarParams = {
  selectListHandler: (e: any, selectedLinkList: LinkListType) => void
  displayCreateNewListHandler: (e: any) => void
  linkLists: LinkListType[]
}

class AppSideBar extends React.Component<AppSideBarParams> {
  render() {
    return (
      <SideNav
        isFixedNav
        expanded={true}
        isChildOfHeader={false}
        aria-label="Side navigation"
      >
        <Button onClick={this.props.displayCreateNewListHandler}>Create new list</Button>
        <SideNavItems>
          {
            this.props.linkLists.map(linkList => (
              <div onClick={(e) => { this.props.selectListHandler(e, linkList) }}>
                <SideNavLink>{linkList.title}</SideNavLink>
              </div>
            ))
          }
        </SideNavItems>
      </SideNav>
    )
  }
}

class LinkTable extends React.Component<{
  deleteLinkHander: (e: any, linkPk: number, linkListPk: number) => void
  displayLinkForm: (e: any) => void

  linkListPk: number
  selectedLinkList: LinkListType
  links: LinkType[]
}> {
  render() {
    const rowData: RowData[] = []

    console.log("this.props.links = ", this.props.links)

    const links: string[] = []
    this.props.links.forEach((linkObject) => {links.push(linkObject.link)})

    console.log("links = ", links)

    // get link preview info
    fetch(`http://127.0.0.1:3006/link-preview?${queryString.stringify({ links })}`)
    .then((resp)=>{return resp.json()})
    .then((data) => {
      console.log("links data = ", data)
    })

    this.props.links.forEach((link) => {
      rowData.push({ ...link, id: rowData.length.toString() })
    })

    console.log("here")
    console.log("rowData = ", rowData)

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
          render={({ rows, headers, getHeaderProps }) => {

            let links = rows.map(row => {
              const linkCell = row.cells.find(cell => {
                return cell.info.header === LinkAttributes.link
              })
              //@ts-ignore
              return linkCell.value
            })


            links = ["https://tesla.com", "https://twitch.com"]
            console.log("links = ", links)
            const qStr = queryString.stringify({ links })
            console.log("qStr = ", qStr)

            return (
                  <TableContainer title={this.props.selectedLinkList?.title}>
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
                      </TableBody>
                    </Table>
                  </TableContainer>
            )
              // .then(data => {
              //   console.log("data = ", data)
              //   return (<h1>hi</h1>)
                // const tableCells = data.map(d => {
                //   console.log("d = ", d)
                //   return (
                //     <TableCell>hellooo</TableCell>
                //   )
                // })
                // return (
                //   <TableContainer title={this.props.selectedLinkList?.title}>
                //     <Table>
                //       <TableHead>
                //         <TableRow>
                //           {headers.map((header) => (
                //             <TableHeader {...getHeaderProps({ header })}>
                //               {header.header}
                //             </TableHeader>
                //           ))}
                //         </TableRow>
                //       </TableHead>
                //       <TableBody>
                //       </TableBody>
                //     </Table>
                //   </TableContainer>
                // )
              // })

          }}
        />

        <Button onClick={this.props.displayLinkForm}>Add new link</Button>
      </div>
    )
  }
}

class ListForm extends React.Component<{
  addNewListHandler: (e: any) => void
  editListAttributeHandler: (e: any, attribute: ListAttributes) => void
  displayTable: (e: any) => void
}> {
  render() {
    return (
      <Form onSubmit={(e) => { this.props.addNewListHandler(e) }}>
        <FormGroup legendText="">
          <TextInput
            // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
            id="titleInput"
            invalidText="Invalid error message."
            labelText="Title"
            placeholder="Placeholder text"
            onChange={(e) => {
              this.props.editListAttributeHandler(e, ListAttributes.title)
            }}
          />
        </FormGroup>
        <Button kind="primary" tabIndex={0} type="submit">
          Submit
          </Button>
        <Button onClick={this.props.displayTable} kind="primary" tabIndex={0}>
          Back
          </Button>
      </Form>
    )
  }
}

class LinkForm extends React.Component<{
  addNewLinkHandler: (e: any, linkListPk: number) => void
  editAttributeHandler: (e: any, attribute: LinkAttributes) => void
  displayTable: (e: any) => void

  linkListPk: number
}> {
  render() {
    return (
      <Form onSubmit={(e) => { this.props.addNewLinkHandler(e, this.props.linkListPk) }}>
        <FormGroup legendText="">
          <TextInput
            // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
            id="titleInput"
            invalidText="Invalid error message."
            labelText="Title"
            placeholder="Placeholder text"
            onChange={(e) => {
              this.props.editAttributeHandler(e, LinkAttributes.title)
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
              this.props.editAttributeHandler(e, LinkAttributes.link)
            }}
          />
        </FormGroup>
        <Button kind="primary" tabIndex={0} type="submit">
          Submit
            </Button>
        <Button onClick={this.props.displayTable} kind="primary" tabIndex={0}>
          Back
            </Button>
      </Form>
    )
  }
}

class LoginPage extends React.Component<{
  loginHandler: (e: any) => void
  editLoginHandler: (e: any, attribute: LoginAttributes) => void
  loginAttempt: boolean
}> {
  render() {
    return (
      <div>
        <AppHeader></AppHeader>
        <Content>
          <Form onSubmit={this.props.loginHandler}>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="linkInput"
                invalidText="Invalid error message."
                labelText="User"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.props.editLoginHandler(e, LoginAttributes.user)
                }}
              />
            </FormGroup>
            <FormGroup legendText="">
              <TextInput
                // helperText="Optional helper text here; if message is more than one line text should wrap (~100 character count maximum)"
                id="dateInput"
                invalid={this.props.loginAttempt}
                invalidText="Incorrect password"
                labelText="Password"
                placeholder="Placeholder text"
                onChange={(e) => {
                  this.props.editLoginHandler(e, LoginAttributes.password)
                }}
              />
            </FormGroup>
            <Button kind="primary" tabIndex={0} type="submit">
              Submit
            </Button>
          </Form>
        </Content>
      </div>
    )
  }
}

class App extends React.Component<
  {},
  {
    display: AppDisplayModes
    links: LinkType[]
    selectedLinkList?: LinkListType,
    linkLists: LinkListType[]
    newLink?: LinkType
    newLinkList?: LinkListType
    user: string
    password: string
    loginAttempt: boolean
  }
  > {
  constructor(props: any) {
    super(props)

    this.state = {
      display: AppDisplayModes.loginForm,
      links: [],
      linkLists: [],
      user: '',
      password: '',
      loginAttempt: false
    }
  }

  // TODO: getListFromDB is a misleading name as it sets the state and deosnt return anything!
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

  private updateListsFromDB = () => {
    fetch('http://127.0.0.1:8000/linklist/')
      .then(r => {
        if (200 <= r.status && r.status < 300) {
          return r.json()
        }
      }).then(data => {
        this.setState({ linkLists: data })
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

  private selectListHandler = (e: any, linkList: LinkListType) => {
    this.getListFromDB(linkList.pk)

    this.setState({
      selectedLinkList: linkList
    })
  }

  private displayCreateNewListHandler = (e: any) => {
    this.setState({
      display: AppDisplayModes.listForm,
      newLinkList: {
        pk: -1,
        title: '',
        date_created: '',
        owner: ''
      }
    })
  }

  private addNewListHandler = (e: any) => {
    e.preventDefault()
    const newList = {
      ...this.state.newLinkList,
      date_created: dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
      owner: "admin"  // TODO: fix after login
    }


    // make a POST request to add list to list of linklists
    fetch('http://127.0.0.1:8000/linklist/', {
      headers: {
        Authorization: `Basic ${Base64.encode(`admin:123passwd123`)}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newList)
    }).then((r) => {
      if (200 <= r.status && r.status < 300) {

        this.updateListsFromDB()

        this.setState({
          display: AppDisplayModes.linkTable,
          newLinkList: undefined
        })
      } else {
        console.log('Add list error', r.status, r.statusText)
      }
    })
  }

  private addNewLinkHandler = (e: any, linkListPk: number) => {
    e.preventDefault()

    const newLink = { ...this.state.newLink, date_added: dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), linklist: 20 }  // TODO: remove this hardcoded 20

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

    this.updateListsFromDB()

    const linkLists = this.state.linkLists

    this.setState({
      display: AppDisplayModes.linkTable,
      selectedLinkList: linkLists[0],
      user: 'admin',
      password: '123passwd123'
    })
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

  private editListAttributeHandler = (e: any, attribute: ListAttributes) => {
    const newList = this.state.newLinkList as LinkListType

    switch (attribute) {
      case ListAttributes.title:
        newList.title = e.target.value
        break

      case ListAttributes.date_created:
        newList.date_created = e.target.value
        break

      case ListAttributes.owner:
        newList.owner = e.target.value
        break
    }

    this.setState({
      newLinkList: newList
    })
  }

  private editLoginHandler = (e: any, attribute: LoginAttributes) => {
    let { user, password } = this.state

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
    const linkListPk = this.state.selectedLinkList ? this.state.selectedLinkList.pk : -1

    let sidebar = <AppSideBar
      selectListHandler={this.selectListHandler}
      displayCreateNewListHandler={this.displayCreateNewListHandler}
      linkLists={this.state.linkLists}>
    </AppSideBar>

    switch (this.state.display) {
      case AppDisplayModes.linkTable:
        return (
          <div>
            <AppHeader></AppHeader>
            {sidebar}
            <Content>
              <LinkTable
                deleteLinkHander={this.deleteLinkHander}
                displayLinkForm={this.displayLinkForm}

                linkListPk={linkListPk}
                selectedLinkList={this.state.selectedLinkList as LinkListType} // Should not be undefined after login handler
                links={this.state.links}
              ></LinkTable>
            </Content>
          </div>
        )

      case AppDisplayModes.listForm:
        return (
          <div>
            <AppHeader></AppHeader>
            {sidebar}
            <Content>
              <ListForm
                addNewListHandler={this.addNewListHandler}
                editListAttributeHandler={this.editListAttributeHandler}
                displayTable={this.displayTable}
              ></ListForm>
            </Content>
          </div>
        )

      case AppDisplayModes.linkForm:
        return (
          <div>
            <AppHeader></AppHeader>
            {sidebar}
            <Content>
              <LinkForm
                addNewLinkHandler={this.addNewLinkHandler}
                editAttributeHandler={this.editAttributeHandler}
                displayTable={this.displayTable}

                linkListPk={linkListPk}
              ></LinkForm>
            </Content>
          </div>
        )

      case AppDisplayModes.loginForm:
        return (
          <LoginPage
            loginHandler={this.loginHandler}
            editLoginHandler={this.editLoginHandler}
            loginAttempt={this.state.loginAttempt}
          ></LoginPage>
        )
    }
  }
}

export default App
