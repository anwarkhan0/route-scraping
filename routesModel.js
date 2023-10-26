import { DataTypes } from 'sequelize';
import { sequelize } from './dbConfig.js';

export const RouteSchema = sequelize.define('routes', {
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  other_content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  }
});

(async () => {
  await sequelize.sync(); 
  console.log('Database synchronized');
})();

export const createRoute = async (data) => {
  try {
    const record = await RouteSchema.create(data);
    console.log('Route added successfully');
    return record;
  } catch (error) {
    console.error('Error adding route:', error);
  }
};

export const getAllRoutes = async () => {
  try {
    const routes = await RouteSchema.findAll();
    return routes;
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
};

