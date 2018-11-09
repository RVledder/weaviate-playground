const typeDefs = `
    type Class {
        id: String!
        instance: String!
        isSelected: Boolean!
        name: String!
        classLocation: String!
        classType: String!
        filters: String!
    }

    type Canvas {
        classIds: [String]
        selectedClasses: [String]
        selectedClass: Class
        zoom: Int
    }

    type ClassesFilters {
        classLocation: String
        classType: String
        queryString: String
    }

    type Query {
        classesFilters: ClassFilters
        canvas: Canvas
        class(id: String!): Class
        classes: [Class]
    }

    type Mutation {
        toggleClassSelectionLibrary(id: String!): Class
        updateClass(id: String!, instance: String!, name: String!, classLocation: String!, classType: String!, filters: String!)
        updateClassSelectionCanvas(id: String!): Canvas
        updateClassesFilters(classLocation: String, classType: String, queryString: String): ClassesFilters
        updateClassSelection(typename: String!): Canvas
    }
`;

export default typeDefs;
