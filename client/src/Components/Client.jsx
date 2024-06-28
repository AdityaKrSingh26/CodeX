import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    return (
        <div className="client px-1">
            <Avatar
                name={username}
                size={50}
                color={Avatar.getRandomColor('sitebase', ['green', 'green', 'green'])}
                round="30px"
            />
            {/* <span className="userName">{username}</span> */}
        </div>
    );
};

export default Client;