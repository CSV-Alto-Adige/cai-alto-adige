import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('http://ec2-15-160-218-140.eu-south-1.compute.amazonaws.com').with(rest());

export default directus;