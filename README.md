# SearchX Front End

SearchX is a scalable collaborative search system being developed by [Lambda Lab](http://www.wis.ewi.tudelft.nl/projects/learning-analytics/) of [TU Delft](https://www.tudelft.nl/).
It is based on [Pineapple Search](http://onlinelibrary.wiley.com/doi/10.1002/pra2.2016.14505301122/full) and is further developed to facilitate collaborative search and sensemaking.

Apart from serving the interface, the front end also manages user data and defines the logs sent back to the backend.
It is built on NodeJS using the [React](https://reactjs.org/) + [Flux](https://facebook.github.io/flux/) framework and is served through [webpack](https://webpack.js.org/).

## Highlight Front End
This is the frontend used for the publication *Note the Highlight: Incorporating Active Reading Tools in a Search as Learning Environment* (CHIIR21). 
It must be used together with with the specific [backend](https://github.com/roynirmal/searchx-back-highlighting) that was also created for the study, where researchers can enable the Active Reading strategies evaluated: highlight, note-taking or both.
This front end is based on the original [SearchX Front End](https://github.com/felipemoraes/searchx-frontend), but it has a completely different document rendering process: instead of showing the website with their complex styling, it is stripped down to black text on white background on a single column and images are left untouched - making highlighting easier to achieve and more impactful to the user.

### SearchX Front End Integration
SearchX is a modular system, so this highlight-specific front end will be integrated back into the original, where features such as the simple document viewer, highlighting tool and notepad are available as features that can be enabled/disabled. The integration is planned for the first half of 2021.

# Setup

- Make sure the [backend](https://github.com/roynirmal/searchx-back-highlighting) is up and running

- Set up the server and install dependencies:
    ```
    // Clone the repository
    git clone https://https://github.com/roynirmal/searchx-front-highlighting.git
    
    // Change directory to repository
    cd searchx-front-highlighting
    
    // Install dependencies:
    npm install
    
    // Copy example configuration
    cp .env.example .env
    ```

- Start the development server:
    ```
    npm start
    
    // Now check http://localhost:8080/search
    ```

## Docker Setup
Go to the [Docker](https://github.com/felipemoraes/searchx#docker) submodule of the main SearchX repository for detailed instructions. Remember to specify the URL of the front end in the Dockerfile as shown in `highlight/docker-images/front/Dockerfile`. 

# Configuration
The main production configuration keys are can be found in your `.env` file. If the backend runs on the same server as the frontend the default values work for local access. If you want access the frontend publicly you need to set at least the `REACT_APP_PUBLIC_URL` key. The keys are:
- `PORT`: the port at which the frontend will run
- `REACT_APP_PUBLIC_URL`: the url at which the server can be accessed publicly
- `REACT_APP_SERVER_URL`: the url at which the backend server can be accessed by the frontend
- `REACT_APP_RENDERER_URL`: the url at which the renderer server can be accessed by the frontend

Configuration to customize SearchX's functionality can be found in `src/js/config.js`. This configuration can be used to toggle various features on and off, see the comments in the file for a description of the available options.

# Modifications

## Logs
To add a new log, you should add a new log event type to `utils/LoggerEventTypes.js` 
and then call the `log` function from `utils/Logger.js` using the new event type. 
The logger will automatically add information on the current user state. 
Any action specific log data can be inserted as an argument when calling the `log` function.

## Tasks
The learning task is defined inside `app/tasks/example-highlight/`.
The forms and interface is defined in the front end, whereas the learning topic selection is managed by the back end.
All form uses [surveyjs](https://surveyjs.io/Overview/Library/) and the results are sent to the back end as logs.

### Modifying the learning task
1. Changing task duration and type  
To change the task duration and task type, you can modify the values inside `config.js`.

2. Changing the pretest / posttest
The pre-task, session instructions and post-task questions are defined inside `PreTest.js`, `Session.js`, and `PostTest.js`, respectively. 

```
// EXAMPLE FORM QUESTIONS

let elements = []
let pages = []

elements.push({
    title: "How many questions?",
    name: "question-numbers",
    type: "text",
    inputType: "number",
    width: 600,
    isRequired: true
});

elements.push({
    title: "What is the question?",
    name: "question-name",
    type: "comment",
    inputType: "text",
    width: 600,
    rows: 4,
    isRequired: false
});
        
pages.push({elements:  elements});
```

### Creating a custom search task
The search interface can be found inside `app/search`, while task specific code can be found inside `app/tasks`.
If you need to extend the interface for a specific task, you should create a new component inside `app/tasks`, and then insert the search interface as a react component. 
You would then need to create a new route for the new component inside `app/App.js`.

## Adding search interface features
The main search interface layout can be found inside `app/search/Search.js`. 
To add a new feature to the search interface, you should a new [react component](https://reactjs.org/docs/components-and-props.html) inside `app/search/feature`, 
and then insert the new feature component inside the layout. 

```
// EXAMPLE COMPONENT

export default class NewComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            // component data
        };
    }

    render() {
        return (
            // html written using jsx
        );
    }
}
```

## Search providers
SearchX supports multiple search providers, which provide the search results that SearchX shows to the user. The Bing and Elasticsearch providers are supported out of the box, respectively providing internet search and full text search on custom datasets.

Each provider can support one or more verticals. For example, the Bing provider provides four verticals: Web, Images, Videos and News. Verticals are shown to the user in the top menu and they can switch between verticals while retaining their current query.

### Adding a new vertical or provider
If you want to add a new vertical or provider, first the searchx-backend needs to be adapted to return the data for your result. See the [searchx-backend documentation](https://github.com/roynirmal/searchx-back-highlighting#search-providers) for instructions on how to do this.

The new vertical or provider needs to be added to the verticalProviders mapping in `src/js/config.js`. The first level of the map contains the provider name as key, and a map as value. The second level contains the vertical name as key, and a reference to the react component that will be used to display the search result as value. You can add your own verticals and providers to this map. Every provider needs to have at least one vertical.

If you wish to add your own component to display search results, add it to `src/js/app/search/results/components/types`, and reference it in the verticalProviders map.


# Citation
If you use the highlighting or note-taking widgets of SearchX to produce results for your scientific publication, please refer to our [CHIIR 2021]() or [ECIR2021]() papers.
```
@inproceedings{roy2021active,
  title={How Do Active Reading Strategies Affect Learning Outcomes in Web Search?},
  author={Roy, Nirmal; Valle Torre, Manuel; Gadiraju, Ujwal; Maxwell, David; Hauff, Claudia},
  booktitle={ECIR},
  year={2021}
}

@inproceedings{roy2021notehighlight,
  title={ Note the Highlight: Incorporating Active Reading Tools for Search As Learning},
  author={Roy, Nirmal; Valle Torre, Manuel; Gadiraju, Ujwal; Maxwell, David; Hauff, Claudia},
  booktitle={CHIIR},
  year={2021}
}
```

# License

[MIT](https://opensource.org/licenses/MIT)
