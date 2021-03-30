import React, { useState } from 'react';
import {useMutation, gql} from '@apollo/client';
import { useHistory } from 'react-router';
import Error from './ErrorMessage';
import ErrorMessage from './ErrorMessage';
import { FEED_QUERY } from './LinkList';
import { LINKS_PER_PAGE } from '../constants';

const CREATE_LINK_MUTATION = gql`
mutation PostMutation(
  $description: String!
  $url: String!
) {
  post(description: $description, url: $url) {
    id
    createdAt
    url
    description
  }
}
`;

const CreateLink = () =>{
    const [formState, setFomeState] = useState({
        url:'',
        description:''
    });
    const [errorState,  setErrorState] = useState({
        error : false
    })

    const history = useHistory();
    const handlerSubmit = (e) =>{
        e.preventDefault();
        createLink();
    }
    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables:{
            url: formState.url,
            description:formState.description
        },
        
        update(cache, {data:{post}}){
            // const take = LINKS_PER_PAGE;
            // const skip = 0;
            // const orderBy = { createdAt: 'desc' };
            const {data} = cache.readQuery({
                query: FEED_QUERY,
                // variables:{
                //     skip,
                //     orderBy,
                //     take
                // }
            })
            cache.writeQuery({
                query:FEED_QUERY,
                data:{
                    feed:{
                        links: [post, ...data.feed.links]
                    }
                },
                // variables:{
                //     skip,
                //     orderBy,
                //     take
                // }
            })
        },
        onCompleted: () => history.push('/new/1'),
        // onError: (e)=>{
        //     setErrorState({
        //         error: true
        //     })
        // },
    })
    const goBack = () =>{
        history.push('/')
    }
    return (
        <div>
        {errorState.error 
        && <div><ErrorMessage gobackCallback={goBack}/></div>
        }
            <form onSubmit={handlerSubmit}>
                <div className="flex flex-column mt3">
                    <label>Url:</label>
                    <input onChange={(ev)=> setFomeState({...formState, url:ev.target.value})} value={formState.url} />
                </div >
                <div className="flex flex-column mt3">
                    <label>Description:</label>
                    <input className="mb2" onChange={(ev)=> setFomeState({...formState, description:ev.target.value})} value={formState.description} />
                </div>
                <div>
                    <button type='submit'>Click to create</button>
                </div>
            </form>
        </div>
    )
}
export default CreateLink;