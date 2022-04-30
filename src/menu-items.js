export default {
    items: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'group',
            icon: 'feather icon-home',
            children: [
                {
                    id: 'blog_view',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/',
                    icon: 'feather icon-home',
                },
            ]
        },
        {
            id: 'blog',
            title: 'Blog',
            type: 'group',
            icon: 'feather icon-ui',
            children: [
                {
                    id: 'blog_view',
                    title: 'Create',
                    type: 'item',
                    url: '/blogEdit',
                    icon: 'feather icon-box',
                },
                {
                    id: 'blog_view',
                    title: 'View',
                    type: 'item',
                    url: '/blog',
                    icon: 'feather icon-box',
                },
            ]
        },
        {
            id: 'mod',
            title: 'Moderation',
            type: 'group',
            icon: 'icon-group',
            children: [
                {
                    id: 'mod-forum',
                    title: 'Forum',
                    type: 'item',
                    url: '/forum',
                    icon: 'feather icon-file-text'
                },

            ]
        },
        {
            id: 'mod-report',
            title: 'Reports',
            type: 'group',
            icon: 'icon-group',
            children: [
                {
                    id: 'mod-forum',
                    title: 'Forums',
                    type: 'item',
                    url: '/forum-report',
                    icon: 'feather icon-file-text'
                },
                {
                    id: 'mod-forum',
                    title: 'Comments',
                    type: 'item',
                    url: '/message-report',
                    icon: 'feather icon-file-text'
                },

            ]
        },
        {
            id: 'mod-chat',
            title: 'Message',
            type: 'group',
            icon: 'feather icon-box',
            children: [
                {
                    id: 'mod-forum',
                    title: 'User Mail',
                    type: 'item',
                    url: '/usermessage',
                    icon: 'feather icon-file-text'
                },
                {
                    id: 'mod-chat',
                    title: 'Association Gaming',
                    type: 'item',
                    url: '/associationmessage',
                    icon: 'feather icon-box'
                }
            ]
        }
    ]
}
