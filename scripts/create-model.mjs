import { writeFile } from 'node:fs/promises'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { model as profileModel } from '@datamodels/identity-profile-basic'
import { ModelManager } from '@glazed/devtools'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'

if (!process.env.SEED) {
  throw new Error('Missing SEED environment variable')
}

const CERAMIC_URL = process.env.CERAMIC_URL || 'https://ceramic-clay.3boxlabs.com'

// The seed must be provided as an environment variable
const seed = fromString(process.env.SEED, 'base16')
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(seed),
  resolver: getResolver(),
})
await did.authenticate()

// Connect to the Ceramic node
const ceramic = new CeramicClient(CERAMIC_URL)
ceramic.did = did

// Create a manager for the model
const manager = new ModelManager({ ceramic })

// Add basicProfile to the model
manager.addJSONModel(profileModel)

// Create the schemas
const noteSchemaID = await manager.createSchema('Note', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Note',
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date-time',
      title: 'date',
      maxLength: 30,
    },
    text: {
      type: 'string',
      title: 'text',
      maxLength: 4000,
    },
    
  },
})
const notesSchemaID = await manager.createSchema('Notes', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NotesList',
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      title: 'notes',
      items: {
        type: 'object',
        title: 'NoteItem',
        properties: {
          id: {
            $comment: `cip88:ref:${manager.getSchemaURL(noteSchemaID)}`,
            type: 'string',
            pattern: '^ceramic://.+(\\?version=.+)?',
            maxLength: 150,
          },
          title: {
            type: 'string',
            title: 'title',
            maxLength: 100,
          },
        },
      },
    },
  },
})



const studentSchema = await manager.createSchema('student', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Student',
  type: 'object',
  properties: {
    Name: {"type":"string","title":"name","maxLength":50},
    Id :{"type":"string","title":"id","maxLength":10},
    college_name:{"type":"string","title":"college_name","maxLength":50},
    college_id:{"type":"string","title":"college_id","maxLength":10},
    phone:{"type":"integer","title":"phone","exclusiveMaximum":10}

      
    },
    // text: {
    //   type: 'string',
    //   title: 'text',
    //   maxLength: 4000,
    // },
    
  
})


// Create the definition using the created schema ID
await manager.createDefinition('notes', {
  name: 'notes',
  description: 'Simple text notes',
  schema: manager.getSchemaURL(notesSchemaID),
})

// await manager.createDefinition('student', {
//   name: 'student',
//   description: 'student details',
//   schema: manager.getSchemaURL(studentSchema),
// })

// Create a Note with text that will be used as placeholder
await manager.createTile(
  'placeholderNote',
  { text: 'This is a placeholder for the note contents...' },
  { schema: manager.getSchemaURL(noteSchemaID) }
)

await manager.createTile(
  'studentNote',
  { text: 'This is a placeholder for the note contents...' },
  { schema: manager.getSchemaURL(studentSchema) }
)

// Write model to JSON file
await writeFile(new URL('model.json', import.meta.url), JSON.stringify(manager.toJSON()))
console.log('Encoded model written to scripts/model.json file')
