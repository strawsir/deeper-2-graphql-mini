import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Links extends Component {
    render() {
        if(this.props.linksQuery.loading){
            return <div>
                LOADING
            </div>
        }
        const data = this.props.linksQuery.links

        return (

            <div>{data.map(link => (
                <div>
                    {link.description} ({link.url})
                </div>
            ))}</div>
        )
    }
}

const LINKS_QUERY = gql`
query linksQuery {
    links{
        id
        url
        description
    }
}
`

export default graphql(LINKS_QUERY, {name: 'linksQuery'})(Links)