import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { NodeEditor } from 'src/components';
import { ClassType } from 'src/types';
import AddIcon from '../icons/AddIcon';

/**
 * Types
 */
export interface IOntologyEditorProps extends WithStyles<typeof styles> {
  className?: string;
  classType?: ClassType;
}

export interface IOntologyEditorState {
  classId?: string;
  className?: string;
  classType?: ClassType;
  isDrawerOpen: boolean;
  nodes: [];
}

const urlParams = new URLSearchParams(window.location.search);
const uri = urlParams.get('weaviateUri') || '';
const url = uri.replace('graphql', '');

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    button: {
      margin: '0.5em 0.9em'
    },
    drawer: {
      backgroundColor: theme.palette.grey[100],
      width: '600px'
    },
    grow: {
      flexGrow: 1
    },
    ontologyActionsContainer: {
      padding: '0.25em'
    },
    paper: {
      margin: '1em'
    },
    paperBody: {
      padding: '1em'
    },
    paperContainer: {
      padding: '1em'
    }
  });

/**
 * Component
 */
class NodeOverview extends React.Component<
  IOntologyEditorProps,
  IOntologyEditorState
> {
  constructor(props: IOntologyEditorProps) {
    super(props);
    this.state = {
      classId: undefined,
      isDrawerOpen: false,
      nodes: []
    };
  }

  public componentWillMount() {
    const { className, classType } = this.props;
    if (className && classType) {
      this.setState({ className, classType });
    }
  }

  public componentDidMount() {
    this.fetchNodes();
  }

  public toggleDrawer = () => {
    const { isDrawerOpen } = this.state;
    const { className } = this.props;

    this.setState({
      classId: undefined,
      className,
      isDrawerOpen: !isDrawerOpen
    });
  };

  public setClassId = (
    classId: string,
    className: string,
    classType: ClassType
  ) => {
    this.setState({
      classId,
      className,
      classType
    });
  };

  public fetchNodes = () => {
    const { className, classType } = this.props;
    const classTypeLowerCase = (classType || '').toLowerCase();
    fetch(`${url}${classTypeLowerCase}`)
      .then(res => res.json())
      .then(res => {
        const nodes = res[classTypeLowerCase];
        const filteredNodes = nodes.filter(
          (node: any) => node['@class'] === className
        );
        this.setState({ nodes: filteredNodes });
      });
  };

  public render() {
    const { className, classType, isDrawerOpen, nodes } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {this.props.className && this.props.classType && (
          <IconButton
            aria-label="Edit thing or action"
            onClick={this.toggleDrawer}
          >
            <AddIcon />
          </IconButton>
        )}

        <Drawer
          open={isDrawerOpen}
          onClose={this.toggleDrawer}
          classes={{ paper: classes.drawer }}
        >
          <AppBar position="static" elevation={1}>
            <Toolbar variant="dense">
              <Typography component="h1" variant="subtitle1" color="inherit">
                {className || 'Untitled schema item'}
              </Typography>

              <div className={classes.grow} />
              <Button
                variant="contained"
                color="primary"
                onClick={this.toggleDrawer}
              >
                <Typography color="inherit" variant="body2">
                  Close
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>

          <div className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <div className={classes.paperBody}>
                <Typography variant="h6">Data instances</Typography>
              </div>
              <Divider />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name/title</TableCell>
                    <TableCell>Id</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nodes.map((node: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>
                        {node.schema.name || node.schema.title || 'Untitled'}
                      </TableCell>
                      <TableCell>
                        {' '}
                        {
                          node[
                            `${(classType || '').toLowerCase().slice(0, -1)}Id`
                          ]
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className={classes.paperBody}>
                <NodeEditor
                  className={className}
                  classType={classType}
                  refetch={this.fetchNodes}
                />
              </div>
            </Paper>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(NodeOverview);
