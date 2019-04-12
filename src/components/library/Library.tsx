import Divider from '@material-ui/core/Divider';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import {
  LibraryClasses,
  LibraryClassSelection,
  LibraryFilters,
  LibraryTextSearch,
  OntologyEditor,
  Section
} from 'src/components';
import {
  CLASSES_FILTERS_QUERY,
  ClassesFiltersQuery,
  SELECTED_CLASSES_QUERY,
  SelectedClassesQuery
} from 'src/components/library/queries';

/**
 * Types
 */
interface ILibraryProps extends WithStyles<typeof styles> {}

interface ILibraryState {
  libraryClassesQuery?: QueryResult;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    classContainer: {
      maxHeight: '25vh',
      overflow: 'scroll'
    }
  });

/**
 * Library component: renders class selection with filter options
 */
class Library extends React.Component<ILibraryProps, ILibraryState> {
  public render() {
    const { classes } = this.props;
    return (
      <Section title="Library" shortTitle="Lib" maxHeight="40vh">
        <ClassesFiltersQuery query={CLASSES_FILTERS_QUERY}>
          {classesFiltersQuery => {
            if (classesFiltersQuery.loading) {
              return 'Loading...';
            }

            if (classesFiltersQuery.error) {
              return `Error! ${classesFiltersQuery.error.message}`;
            }

            if (!classesFiltersQuery.data) {
              // TODO: Replace with proper message
              return null;
            }

            const selectedClassLocation =
              classesFiltersQuery.data.classesFilters.classLocation;
            const selectedClassType =
              classesFiltersQuery.data.classesFilters.classType;

            return (
              <React.Fragment>
                <LibraryTextSearch />
                <LibraryFilters
                  selectedClassLocation={selectedClassLocation}
                  selectedClassType={selectedClassType}
                />

                <SelectedClassesQuery query={SELECTED_CLASSES_QUERY}>
                  {selectedClassesQuery => {
                    if (selectedClassesQuery.loading) {
                      return 'Loading...';
                    }

                    if (selectedClassesQuery.error) {
                      return `Error! ${selectedClassesQuery.error.message}`;
                    }

                    if (!selectedClassesQuery.data) {
                      // TODO: Replace with proper message
                      return null;
                    }
                    const selectedClasses =
                      selectedClassesQuery.data.canvas.selectedClasses;
                    return (
                      <React.Fragment>
                        <div className={classes.classContainer}>
                          <LibraryClassSelection
                            selectedClasses={selectedClasses}
                          />
                          <LibraryClasses />
                          <Divider />
                        </div>
                        <Divider />
                        <div>
                          <OntologyEditor />
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SelectedClassesQuery>
              </React.Fragment>
            );
          }}
        </ClassesFiltersQuery>
      </Section>
    );
  }
}

export default withStyles(styles)(Library);
