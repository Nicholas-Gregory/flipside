import BrowseConversations from "./BrowseConversations";
import NewConversation from "./NewConversation";
import Profile from "./Profile";

export default function Dashboard({ loggedIn, currentPage }) {
    if (currentPage === 'browse') {
        return <BrowseConversations />
    } else if (currentPage === 'profile') {
        return <Profile loggedIn={loggedIn}/>
    } else if (currentPage === 'start') {
        return <NewConversation loggedIn={loggedIn}/>
    }
}