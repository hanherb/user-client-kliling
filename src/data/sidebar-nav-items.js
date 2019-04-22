export default function () {
  return [{
    title: 'Dashboards',
    items: [{
      title: 'Analytics',
      to: '/analytics',
      htmlBefore: '<i class="material-icons">&#xE917;</i>',
      htmlAfter: '',
    }],
  },
  {
    title: 'Data',
    items: [{
      title: 'Users',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'users',
      },
    }, {
      title: 'Import CSV',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'importcsv',
      },
    },{
      title: 'Companies',
      htmlBefore: '<i class="material-icons">&#xE7FD;</i>',
      to: {
        name: 'company-list',
      },
    }, {
      title: 'Goods',
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: {
        name: 'company-list',
      },
    }],
  }, {
    title: 'Miscellaneous',
    items: [{
      title: 'Overview',
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: {
        name: 'components-overview',
      },
    }, {
      title: 'Add New Post',
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: {
        name: 'add-new-post',
      },
    }, {
      title: 'Blog Posts',
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: {
        name: 'blog-posts',
      },
    }],
  },
  ];
}
