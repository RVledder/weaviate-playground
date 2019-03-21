import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Keywords } from 'src/types';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
export interface IOntologyEditorPropertyProps
  extends WithStyles<typeof styles> {
  className?: string;
  classType?: string;
}

export interface IOntologyEditorPropertyState {
  cardinality: string;
  dataType: any;
  description: string;
  isDisabled: boolean;
  isDrawerOpen: boolean;
  keywords: Keywords;
  propertyName: string;
  propertyNameError: boolean;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    button: {
      margin: '0.25em'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    drawer: {
      backgroundColor: theme.palette.grey[100],
      maxWidth: '500px'
    },
    grow: {
      flexGrow: 1
    },
    ontologyActionsContainer: {
      padding: '0.25em'
    },
    paper: {
      margin: '1em',
      padding: '1em'
    },
    paperContainer: {
      padding: '1em'
    }
  });

const dataTypes = [
  {
    dataType: 'string',
    formatting: 'string',
    weaviateType: 'string'
  },
  {
    dataType: 'int64',
    formatting: '0',
    weaviateType: 'int'
  },
  {
    dataType: 'boolean',
    formatting: 'true / false',
    weaviateType: 'boolean'
  },
  {
    dataType: 'float64',
    formatting: '0.0',
    weaviateType: 'number'
  },
  {
    dataType: 'string',
    formatting: 'ISO 8601',
    weaviateType: 'date'
  },
  {
    dataType: 'text',
    formatting: 'string',
    weaviateType: 'text'
  },
  {
    dataType: 'string',
    formatting: '0',
    weaviateType: 'CrossRef'
  },
  {
    dataType: 'string',
    formatting: '0',
    weaviateType: 'geoCoordinates'
  }
];

/**
 * Component
 */
class OntologyEditorProperty extends React.Component<
  IOntologyEditorPropertyProps,
  IOntologyEditorPropertyState
> {
  constructor(props: IOntologyEditorPropertyProps) {
    super(props);
    this.state = {
      cardinality: 'atMostOne',
      dataType: 'string',
      description: '',
      isDisabled: true,
      isDrawerOpen: false,
      keywords: [],
      propertyName: '',
      propertyNameError: false
    };
  }

  public setFormField = (name: string) => (event: any) => {
    // @ts-ignore
    this.setState({ [name]: event.target.value });
  };

  public validateFormField = (name: string) => (event: any) => {
    const { propertyName } = this.state;
    if (name === 'className') {
      if (propertyName === '') {
        this.setState({
          isDisabled: true,
          propertyNameError: true
        });
      } else {
        this.setState({ isDisabled: false, propertyNameError: false });
      }
    }
  };

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;

    this.setState({
      isDrawerOpen: !isDrawerOpen
    });
  };

  public savePropertyMutation = (savePropertyMutation: any) => {
    const {
      cardinality,
      dataType,
      description,
      keywords,
      propertyName
    } = this.state;
    const { className, classType } = this.props;

    savePropertyMutation({
      variables: {
        body: {
          '@dataType': [dataType],
          cardinality,
          description,
          keywords,
          name: propertyName
        },
        className,
        classType: (classType || '').toLowerCase()
      }
    })
      .then(() => {
        this.setState({ isDrawerOpen: false });
      })
      // tslint:disable-next-line:no-console
      .catch(console.log);
  };

  public render() {
    const { dataType, description, isDrawerOpen, propertyName } = this.state;
    const { classes, className } = this.props;

    return (
      <div className={classes.ontologyActionsContainer}>
        <Button
          variant="outlined"
          onClick={this.toggleDrawer}
          disabled={!className}
        >
          <Typography>Add property</Typography>
        </Button>

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography color="inherit">New property</Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Property definition</Typography>

              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    required={true}
                    id="propertyName"
                    name="propertyName"
                    label="Property name"
                    helperText="Helper text"
                    value={propertyName}
                    onChange={this.setFormField('propertyName')}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty propertyName"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="data-type"
                    select={true}
                    label="Select"
                    fullWidth={true}
                    value={dataType}
                    onChange={this.setFormField('dataType')}
                    helperText="Helper text"
                    margin="normal"
                  >
                    {dataTypes.map((dataTypex, i) => (
                      <MenuItem key={i} value={dataTypex.weaviateType}>
                        {dataTypex.weaviateType}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    helperText="Helper text"
                    value={description}
                    onChange={this.setFormField('description')}
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty description"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={6}>
                  <TextField
                    required={true}
                    id="keyword"
                    name="keyword"
                    label="Keyword"
                    helperText="Helper text"
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty keyword"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={4}>
                  <TextField
                    required={true}
                    id="weight"
                    name="weight"
                    label="Weight"
                    helperText="Helper text"
                    fullWidth={true}
                    autoComplete="ontologyEditorProperty weight"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={2}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={this.toggleDrawer}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              <div className={classes.buttonContainer}>
                <Button
                  variant="text"
                  size="small"
                  onClick={this.toggleDrawer}
                  className={classes.button}
                >
                  Cancel
                </Button>
                <Mutation
                  mutation={gql`
                    mutation createClass(
                      $classType: String!
                      $className: String!
                      $body: Body!
                    ) {
                      saveProperty(
                        classType: $classType
                        className: $className
                        body: $body
                      )
                        @rest(
                          type: "Class"
                          path: "schema/{args.classType}/{args.className}/properties"
                          method: "POST"
                          bodyKey: "body"
                        ) {
                        NoResponse
                      }
                    }
                  `}
                >
                  {(savePropertyMutation, result) => (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      className={classes.button}
                      onClick={this.savePropertyMutation.bind(
                        null,
                        savePropertyMutation
                      )}
                    >
                      Save property
                    </Button>
                  )}
                </Mutation>
              </div>
            </Paper>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(OntologyEditorProperty);
